// tools/minify-falcon-safe.js
// Usage: node tools/minify-falcon-safe.js <input> <output>

import fs from "fs";
import path from "path";

const input = process.argv[2] ?? "falcon/falcon.js";
const output = process.argv[3] ?? "falcon/falcon.min.js";

if (!fs.existsSync(input)) {
    console.error("Input not found:", input);
    process.exit(2);
}

const src = fs.readFileSync(input, "utf8");

let out = "";
const len = src.length;

let i = 0;
let inSingle = false;
let inDouble = false;
let inBacktick = false;
let inLineComment = false;
let inBlockComment = false;
let escape = false;

// For template literal ${ ... } handling:
let templateExprDepth = 0;
let inTemplateExpr = false;

function isSpace(ch) {
    return ch === " " || ch === "\t" || ch === "\n" || ch === "\r" || ch === "\f" || ch === "\v";
}

// punctuation to tighten around (exclude '/' to avoid regex/div ambiguity)
const punct = new Set(["=", ";", "{", "}", "(", ")", ",", ":", "+", "-", "*", "<", ">", "?", "&", "|", "^", "%", "!", "~", "[", "]"]);

while (i < len) {
    const ch = src[i];
    const ch1 = src[i + 1];

    // handle entering/exiting comments (unless inside strings/template)
    if (!inSingle && !inDouble && !inBacktick && !inBlockComment && !inLineComment) {
        if (ch === "/" && ch1 === "/") {
            inLineComment = true;
            i += 2;
            continue;
        }
        if (ch === "/" && ch1 === "*") {
            inBlockComment = true;
            i += 2;
            continue;
        }
    }

    if (inLineComment) {
        if (ch === "\n") {
            inLineComment = false;
            // consume newline but do not emit; will be removed
        }
        i += 1;
        continue;
    }

    if (inBlockComment) {
        if (ch === "*" && ch1 === "/") {
            inBlockComment = false;
            i += 2;
            continue;
        }
        i += 1;
        continue;
    }

    // Strings & template literals handling
    if (!inSingle && !inDouble && !inBacktick) {
        if (ch === "'") {
            inSingle = true;
            out += ch;
            i++;
            escape = false;
            continue;
        } else if (ch === '"') {
            inDouble = true;
            out += ch;
            i++;
            escape = false;
            continue;
        } else if (ch === "`") {
            inBacktick = true;
            out += ch;
            i++;
            escape = false;
            continue;
        }
    } else {
        // we are inside a quoted context
        if (inSingle) {
            out += ch;
            if (!escape && ch === "'") {
                inSingle = false;
            }
            escape = !escape && ch === "\\";
            i++;
            continue;
        }
        if (inDouble) {
            out += ch;
            if (!escape && ch === '"') {
                inDouble = false;
            }
            escape = !escape && ch === "\\";
            i++;
            continue;
        }
        if (inBacktick) {
            // handle template literal `${ ... }`
            out += ch;
            if (!escape && ch === "`" && templateExprDepth === 0 && !inTemplateExpr) {
                inBacktick = false;
                i++;
                continue;
            }
            if (!escape && ch === "$" && src[i + 1] === "{") {
                // enter template expression
                inTemplateExpr = true;
                templateExprDepth = 0;
                // emit next '{' as well
                i++;
                out += "{";
                i++;
                continue;
            }
            if (inTemplateExpr) {
                // we are inside ${ ... } until matching brace
                // we still need to keep parsing strings/comments inside expression correctly:
                // approach: use a simple brace depth counter and copy chars as-is,
                // but also keep string/comment handling inside expression minimal by toggling simple flags
                // to avoid mis-closing.
                // We'll do a tiny inline parser for template expr:
                i++; // we've already emitted current char
                let exprOut = "";
                // small state machine for the expression:
                let exprSingle = false, exprDouble = false, exprBlockComment = false, exprLineComment = false, exprEscape = false;
                while (i < len) {
                    const eCh = src[i];
                    const eCh1 = src[i + 1];

                    if (exprLineComment) {
                        if (eCh === "\n") {
                            exprLineComment = false;
                        }
                        exprOut += eCh;
                        i++;
                        continue;
                    }
                    if (exprBlockComment) {
                        if (eCh === "*" && eCh1 === "/") {
                            exprBlockComment = false;
                            exprOut += "*/";
                            i += 2;
                            continue;
                        }
                        exprOut += eCh;
                        i++;
                        continue;
                    }

                    if (!exprSingle && !exprDouble) {
                        if (eCh === "/" && eCh1 === "/") {
                            exprLineComment = true;
                            exprOut += "//";
                            i += 2;
                            continue;
                        }
                        if (eCh === "/" && eCh1 === "*") {
                            exprBlockComment = true;
                            exprOut += "/*";
                            i += 2;
                            continue;
                        }
                    }

                    if (!exprSingle && !exprDouble && eCh === "'") {
                        exprSingle = true;
                        exprOut += eCh;
                        i++;
                        exprEscape = false;
                        continue;
                    }
                    if (!exprSingle && !exprDouble && eCh === '"') {
                        exprDouble = true;
                        exprOut += eCh;
                        i++;
                        exprEscape = false;
                        continue;
                    }
                    if (exprSingle) {
                        exprOut += eCh;
                        if (!exprEscape && eCh === "'") {
                            exprSingle = false;
                        }
                        exprEscape = !exprEscape && eCh === "\\";
                        i++;
                        continue;
                    }
                    if (exprDouble) {
                        exprOut += eCh;
                        if (!exprEscape && eCh === '"') {
                            exprDouble = false;
                        }
                        exprEscape = !exprEscape && eCh === "\\";
                        i++;
                        continue;
                    }

                    // outside nested strings/comments in template expression
                    if (eCh === "{") {
                        templateExprDepth++;
                        exprOut += eCh;
                        i++;
                        continue;
                    }
                    if (eCh === "}") {
                        if (templateExprDepth === 0) {
                            // close expression
                            out += exprOut + "}";
                            i++;
                            inTemplateExpr = false;
                            templateExprDepth = 0;
                            break;
                        } else {
                            templateExprDepth--;
                            exprOut += eCh;
                            i++;
                            continue;
                        }
                    }
                    exprOut += eCh;
                    i++;
                }
                continue;
            }
            // normal backtick char handling
            escape = !escape && ch === "\\";
            i++;
            continue;
        }
    }

    // outside strings/comments: remove newlines, collapse spaces, tighten punctuation
    if (isSpace(ch)) {
        // skip all newline/space runs, emit a single space only if surrounding tokens are alphanumeric (to avoid merging tokens)
        // peek previous output char and next non-space char
        let j = i + 1;
        while (j < len && isSpace(src[j])) j++;
        const next = src[j] ?? "";
        const prev = out.length > 0 ? out[out.length - 1] : "";
        // if either prev or next is punctuation, we can drop the space entirely (we'll tighten later)
        if (prev && punct.has(prev)) {
            // drop
        } else if (next && punct.has(next)) {
            // drop
        } else {
            // emit a single space
            if (out.length === 0 || out[out.length - 1] === " ") {
                // skip
            } else {
                out += " ";
            }
        }
        i = j;
        continue;
    }

    // tighten spaces around punctuation: if previous char in out is space and current is punctuation, drop the space
    if (punct.has(ch)) {
        // remove trailing space before punctuation
        if (out.endsWith(" ")) out = out.slice(0, -1);
        out += ch;
        // skip any immediate space after punctuation
        let j = i + 1;
        while (j < len && isSpace(src[j])) j++;
        i = j;
        continue;
    }

    // default: copy char
    out += ch;
    i++;
}

// final trim
out = out.trim();

// tiny post-pass: remove spaces before/after = and ; etc if left
out = out.replace(/\s*([=;{}(),:+\-*<>?&|^%!~\[\]])\s*/g, "$1");

// write
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, out, "utf8");
const size = Buffer.byteLength(out);
console.log(`✅ Minified ${input} → ${output} (${size} bytes)`);
