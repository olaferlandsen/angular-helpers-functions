/**
*   How to use it?
*       You only need set 'ng-number' attribute on you input like
            Example:
                Only integer
*                   <input ng-model="myModel" ng-number>
*               Integer and decimal
*                   <input ng-model="myModel" ng-number allow-decimal>
*
*   How to integrate?
*       You need copy this code and paste after you module definition on you Angular app.
*           Example:
*               module('controllers', [])
*               .directive('ngNumber', ...)
*               .controller('myCtrl', ...)
*
*   Support
*       This directive can support next key:
*           Numbers and only one dot like decimal:
*               0, 1, 2, 3, 4, 5, 6, 7, 8, 9 and .(dot)
*           Special:
*               backspace, left arrow, right arrow, tab, escape,
*               ctrl+c, ctrl+v, ctrl+x, ctrl+f, ctrl+a, ctrl+r,
*               insert, delete and shift
*           Combinations for Windows, Linux and OSX:
*               Copy        -   ctrl+c, cmd+c and contextual menu
*               Paste       -   ctrl+v, cmd+v and contextual menu
*               Cut         -   ctrl+x, cmd+x and contextual menu
*               Select all  -   ctrl+a, cmd+a and contextual menu
*               Find        -   ctrl+f and cmd+f
*               Refresh Page-   ctrl+r and cmd+r
*               Input       -   keydown, keypress and keyup
*               Escape      -   esc
*   Formats:
*       Example:
*           0 (integer)
*           0.1 (float/double/decimal)
*/
.directive('ngNumber', function () {
    return function (scope, element, attrs) {
        var platform    = navigator.platform.toLowerCase();
        var isOsx       = platform.indexOf('mac') > -1 ? true : false;
        var isWin       = platform.indexOf('win') > -1 ? true : false;
        var isLinux     = (
            platform.indexOf('linux') > -1 || platform.indexOf('x11') > -1
        ) ? true : false;
        var actions     = ['arrowleft','arrowright','backspace','escape','tab','shift', 'delete', 'insert'];
        var alphabet    = ['a','v', 'c', 'x', 'r', 's', 'f', 'arrowleft','arrowright'];
        var numbers     = ['1','2','3','4','5','6','7','8','9','0'];
        var allowDecimal= attrs.hasOwnProperty('allowDecimal') ? true : false;
        var maxlength   = Math.abs(parseInt(attrs.max) || parseInt(attrs.ngMax) || parseInt(attrs.maxlength) || parseInt(attrs.ngMaxlength));
        // handle kwydown event
        element.bind('keydown', function (event) {
            var combinations= false;
            var key         = event.key.toString().toLowerCase();
            // combinations for Windows, Linux and OSX
            // Accept: copy(ctrl+c), paste(ctrl+v), cut(ctrl+x), select all(ctrl+a), refresh(ctrl+r), find(ctrl+f) and save(ctrl+s)
            if (isWin === true && event.ctrlKey === true) {
                combinations = true;
            }
            else if (isLinux === true && event.ctrlKey === true) {
                combinations = true;
            }
            else if (isOsx === true && event.metaKey === true) {
                combinations = true;
            }
            // Dot
            if (key=== '.') {
                if (maxlength == (element.val().length+1)) {
                    event.preventDefault();
                }
                else if (allowDecimal === true) {
                    if (!/^\d+/.test(element.val())) {
                        event.preventDefault();
                    }
                    else if(element.val().indexOf('.') > -1) {
                        event.preventDefault();
                    }
                    return true;
                }
            }
            // Evaluate combination
            else if(combinations === true) {
                if (alphabet.indexOf(key) == -1) {
                    event.preventDefault()
                }
                return true;
            }
            // Tab, Arrows, Backspace, Escape, delete, insert and Shift
            // Numbers
            else if(
                numbers.indexOf(key) < 0
                && actions.indexOf(key) < 0
            ) {
                event.preventDefault();
            }
            return true;
        })
        // need detect contextual menu qith paste
        .bind('input', function(event) {
            // capture value and trim it
            var value = element.val().trim();
            // replace all not number(except .)
            value = value.replace(/[^\d\.]+/g,'');
            // remove first and last character if it is .
            value = value.replace(/(^\.|\.$)/g, '')
            // remove all . except first
            // this only work for this format:
            // 1.000.000 -> 1.000000
            // 1.00.2 -> 1.002
            value = value.replace(/^([^.]*\.)(.*)$/, function ( a, b, c ) {
                return b + c.replace(/\./g, '');
            })
            // remove first zero if exists(only is like 0001 and not 0.001)
            value = value.replace(/^0([\d]+)$/, '$1')
            // set new value
            element.val(value)
        });
    }
})
