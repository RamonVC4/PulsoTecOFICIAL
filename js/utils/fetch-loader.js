(function () {
    if (typeof window === "undefined" || typeof window.fetch !== "function") return;
    if (window.__fetchLoaderPatched) return;
    window.__fetchLoaderPatched = true;

    const state = {
        pending: 0,
        timer: null,
        visible: false,
        shownAt: 0,
        showDelayMs: 140,
        minVisibleMs: 10
    };

    function ensureStyles() {
        if (document.getElementById("global-loader-style")) return;

        const style = document.createElement("style");
        style.id = "global-loader-style";
        style.textContent = [
            ".loader-overlay{position:fixed;inset:0;display:grid;place-items:center;background:rgba(255,255,255,.55);backdrop-filter:blur(1px);z-index:9999}",
            ".loader-overlay[hidden]{display:none}",
            ".loader-spinner{width:44px;height:44px;border:4px solid #d9d9d9;border-top-color:#0b5fff;border-radius:50%;animation:loader-spin .8s linear infinite}",
            "@keyframes loader-spin{to{transform:rotate(360deg)}}"
        ].join("");
        document.head.appendChild(style);
    }

    function ensureOverlay() {
        let overlay = document.getElementById("global-loader");
        if (overlay) return overlay;

        overlay = document.createElement("div");
        overlay.id = "global-loader";
        overlay.className = "loader-overlay";
        overlay.hidden = true;
        overlay.setAttribute("aria-live", "polite");
        overlay.setAttribute("aria-busy", "true");
        overlay.innerHTML = '<div class="loader-spinner" aria-label="Cargando"></div>';

        if (document.body) {
            document.body.appendChild(overlay);
        } else {
            document.addEventListener("DOMContentLoaded", function () {
                if (!document.getElementById("global-loader")) document.body.appendChild(overlay);
            }, { once: true });
        }

        return overlay;
    }

    function showOverlay() {
        const overlay = ensureOverlay();
        if (!overlay || state.visible) return;
        overlay.hidden = false;
        state.visible = true;
        state.shownAt = Date.now();
    }

    function hideOverlay() {
        const overlay = document.getElementById("global-loader");
        if (!overlay || !state.visible) return;
        overlay.hidden = true;
        state.visible = false;
    }

    function beginRequest() {
        state.pending += 1;
        if (state.visible || state.timer) return;

        state.timer = setTimeout(function () {
            state.timer = null;
            if (state.pending > 0) showOverlay();
        }, state.showDelayMs);
    }

    function endRequest() {
        state.pending = Math.max(0, state.pending - 1);
        if (state.pending > 0) return;

        if (state.timer) {
            clearTimeout(state.timer);
            state.timer = null;
        }

        if (!state.visible) return;

        const elapsed = Date.now() - state.shownAt;
        const remaining = state.minVisibleMs - elapsed;
        if (remaining > 0) {
            setTimeout(function () {
                if (state.pending === 0) hideOverlay();
            }, remaining);
            return;
        }

        hideOverlay();
    }

    function stripLoaderOption(init) {
        if (!init || typeof init !== "object" || !Object.prototype.hasOwnProperty.call(init, "showLoader")) {
            return { init: init, skip: false };
        }
        const nextInit = Object.assign({}, init);
        const skip = nextInit.showLoader === false;
        delete nextInit.showLoader;
        return { init: nextInit, skip: skip };
    }

    const originalFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
        const parsed = stripLoaderOption(init);
        if (parsed.skip) {
            return originalFetch(input, parsed.init);
        }

        beginRequest();
        return originalFetch(input, parsed.init).finally(endRequest);
    };

    window.showGlobalLoader = beginRequest;
    window.hideGlobalLoader = endRequest;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            ensureStyles();
            ensureOverlay();
        }, { once: true });
    } else {
        ensureStyles();
        ensureOverlay();
    }
})();
