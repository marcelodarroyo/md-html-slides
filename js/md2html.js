//=============================================================================
// simple markdown for html presentation
// Markdown content format:
//
// # Heading          -->         <div class="heading">Heading</div>
// 
// content                        <div class="content cls1 cls2">content</div>
//                              </div>
//=============================================================================

function markdown2html(text) {
    let blocks = text.trim().split(/\n\n+/);
    let h = '<div class="slide">\n';
    const content = '<div class="content';
    let match;

    // inline regular expressions
    let boldem = /\*{3}([^\*]+)\*{3}/g;
    let bold = /\*{2}([^\*]+)\*{2}/g
    let em = /[\*_]([^\*_]+)[\*_]/g;

    // block regular expressions
    let items = /^ *-|(\d+\.) +/gm;
    let header = /^ *(#{1,6}) (.+)$/;
    let contentClass = /^\./;
    let code = /^ *`{3,}(.+)\n([^`]*)`{3,} *$/
    let blockquote = /^ *>[! ]/mg;
    let htmlTag = /^ *<.+> *$/;
    let image = /^ *!\[([^\]]*)]\((\S+) ?([^\)]*)\)/;
    
    function inline(text) {
        return text.
            replaceAll(boldem, '<b><em>$1</em></b>').
            replaceAll(bold, '<b>$1</b>').
            replaceAll(em, '<em>$1</em>');
    }

    for (const block of blocks) {

        // content classes
        if (match = block.match(contentClass) && h.endsWith('"content')) {
            h += ' ' + block.substring(1) + '">\n';
            continue;
        }

        // close content div opener tag if no classes line
        if (h.endsWith('"content')) h += '">\n';

        // headers
        if (match = block.match(header)) {
            const l = match[1].length;
            if (l == 1)
                h += `<div class="heading">\n${match[2]}\n</div>\n` + content;
            else {
                h += `<h${l}>${match[2]}</h${l}>\n`;
            }
            continue;
        }
        
        // html tag
        if (match = block.match(htmlTag)) {
            html += match[0];
            continue;
        }

        // code (fenced) block
        if (match = block.match(code)) {
            const lang = match[1].trim();
            let l = lang ? ` class="language-${lang}"` : '';
            const txt = match[2];
            if (lang == 'td2svg')
                h += diagram2svg(txt) + '\n';
            else
                h += `<pre><code${l}>${txt}</code></pre>\n`;
            continue;
        }

        // list items
        if (match = block.match(items)) {
            const tag = match[0].trim() == '-' ? 'ul' : 'ol';
            const txt = inline(block.substring(match[0].length));
            h += `<${tag}>\n<li>`;
            h += txt.replaceAll(items, '</li>\n<li>');
            h += `\n</li>\n</${tag}>\n`;
            continue;
        }

        // blockquote
        if (match = block.match(blockquote)) {
            let c = match[0].trim() == '>!' ? ' class="alarm">\n' : '>\n';
            h += '<blockquote' + c;
            h += inline(block.replaceAll(blockquote, ''));
            h += '\n</blockquote>\n';
            continue;
        }

        // image
        if (match = block.match(image)) {
            let attrs = match[3] || '';
            h += '<figure>\n';
            h += `<img alt="${match[1]}" src="${match[2]}" ${attrs}>\n`;
            h += `<figcaption>${match[1]}</figcaption>\n</figure>\n`;
            continue;
        }

        // normal paragraph
        h += '<p>' + inline(block) + '</p>\n';
    }
    return h + '</div></div>\n';
}