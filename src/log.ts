export const LogDebug = (() => {
    let _isDebug = false;
    function init(isDebug: boolean) {
        _isDebug = isDebug;
    }

    function log(...args: unknown[]) {
        if (_isDebug) {
            console.debug(...args);
        }
    }

    return { init, log };
})();
