export const Logger = (() => {
    let _isDebug = false;
    let _isVerbose = false;
    function init(options = { debug: false, verbose: false }) {
        _isDebug = options.debug;
        _isVerbose = options.verbose;
    }

    function debug(...args: unknown[]) {
        if (_isDebug) {
            console.debug(...args);
        }
    }

    function log(...args: unknown[]) {
        if (_isVerbose || _isDebug) {
            console.log(...args);
        }
    }

    return { init, debug, log };
})();
