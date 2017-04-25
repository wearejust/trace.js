const element = document.createElement('div');
element.id = 'trace-window';
element.style.cssText = 'background-color: #fff; border: solid 1px black; color: #000; font-family: Arial; font-size: 12px; left: 0; max-width: 70vw; position: fixed; top: 0; white-space: nowrap; z-index: 9999999;';

const content = document.createElement('div');
content.id = 'trace-content';
content.style.cssText = 'max-height: 100vh; padding: 5px 25px 5px 5px; overflow: auto;';
element.appendChild(content);

let close = document.createElement('div');
close.id = 'trace-close';
close.onclick = hide.bind(this);
close.style.cssText = 'color: #fff; content: ""; cursor: pointer; font-size: 16px; left: 100%; line-height: 1; padding: 4px 6px; position: absolute; top: 0; z-index: 1;';
close.innerHTML = '×';
element.appendChild(close);

function parse(args) {
    let type = Object.prototype.toString.call(args);

    if (type == '[object Arguments]') {
        args = Array.prototype.slice.call(args);
    } else if (type != '[object Array]') {
        args = [args];
    }

    return args;
}

function add(args) {
    let line = document.createElement('p');
    line.style.cssText = 'margin: 0; padding: 0;';
    line.innerHTML = parse(args).join(', ');
    content.appendChild(line);
    content.scrollTop = content.scrollHeight;
}

function recursive(args, indent) {
    if (!indent) {
        args = parse(args);
        indent = 0;
    }

    let a, arg;
    for (a in args) {
        arg = args[a];
        if (typeof(arg) == 'object') {
            add('<span style="padding-left: ' + (indent * 2) + 'em;"><b>+ [' + a + ']</b> <span style="color:#999;">' + Object.prototype.toString.call(arg) + '</span>');
            recursive(arg, indent + 1);
        } else {
            add('<span style="padding-left: ' + (indent * 2) + 'em;"><b>- ' + a + ':</b> ' + arg + '</span>');
        }
    }
}

function show() {
    element.style.display = 'block';
    if (!element.parentElement) {
        document.body.appendChild(element);
    }
}

function hide() {
    element.style.display = 'none';
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

module.exports = function() {
    if (arguments.length) {
        add(arguments);
        show();
    } else {
        hide();
    }
};

module.exports.r = function() {
    recursive(arguments);
    show();
};

let ms_limit, ms_time, ms_index;
module.exports.ms = function(limit) {
    if(limit || !ms_time) {
        ms_limit = (limit && !isNaN(parseInt(limit))) ? limit : false;
        ms_time = new Date().getTime();
        ms_index = 0;

    } else {
        ms_index++;
        let ms = (new Date().getTime() - ms_time);
        if (ms_limit && ms > ms_limit) ms = '<span style="color:red;">'+ms+'</span>';
        add('[' + ms_index + '] <b>' + ms + '</b> ms');
        show();
    }
};