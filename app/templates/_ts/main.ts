///<reference path="./definitions/jquery.d.ts"/>
///<reference path="./definitions/modernizr.d.ts"/>
'use strict';
class Main {
    constructor() {
        (function($) {
            $(document).ready(() => {
                console.log('Hello from app/scripts/ts/Main.ts');
            });
        })(jQuery);
    }
}

var main:Main = new Main();