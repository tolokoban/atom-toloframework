'use babel';

export function tag(name, ...args) {
    const tag = document.createElement(name.trim().toLowerCase());

    args.forEach(function (arg) {
        if( Array.isArray(arg) ) {
            arg.forEach(function (child) {
                if( typeof child === 'string' || typeof child === 'number' ) {
                    const textNode = document.createTextNode(`${child}`);
                    tag.appendChild( textNode );
                }
                else if( !child ){
                    return;
                }
                else {
                    tag.appendChild( child );
                }
            });
        }
        else if( typeof arg === 'string') {
            tag.classList.add(arg);
        }
        else {
            for( const key of Object.keys(arg) ) {
                tag.setAttribute( key, arg[key] );
            }
        }
    });

    return tag;
}

export function div(...args) {
    return tag("div", ...args);
}
