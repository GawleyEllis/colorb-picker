document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('colorPicker');
    const colorPreview = document.querySelector('.color-preview');
    const rgbInputs = {
        r: document.getElementById('r'),
        g: document.getElementById('g'),
        b: document.getElementById('b'),
    };
    const hsvInputs = {
        h: document.getElementById('h'),
        s: document.getElementById('s'),
        v: document.getElementById('v'),
    };
    const hexInput = document.getElementById('hex');

    function updateColorPreview(color) {
        colorPreview.style.backgroundColor = color;
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    }

    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    function rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;

        const d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }

    function hsvToRgb(h, s, v) {
        let r, g, b;
        h = h / 360;
        s = s / 100;
        v = v / 100;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    colorPicker.addEventListener('input', () => {
        const color = colorPicker.value;
        updateColorPreview(color);

        const { r, g, b } = hexToRgb(color);
        rgbInputs.r.value = r;
        rgbInputs.g.value = g;
        rgbInputs.b.value = b;

        const { h, s, v } = rgbToHsv(r, g, b);
        hsvInputs.h.value = h;
        hsvInputs.s.value = s;
        hsvInputs.v.value = v;

        hexInput.value = color.toUpperCase();
    });

    function updateColorFromInputs() {
        const r = parseInt(rgbInputs.r.value) || 0;
        const g = parseInt(rgbInputs.g.value) || 0;
        const b = parseInt(rgbInputs.b.value) || 0;
        const color = rgbToHex(r, g, b);
        colorPicker.value = color;
        updateColorPreview(color);

        const { h, s, v } = rgbToHsv(r, g, b);
        hsvInputs.h.value = h;
        hsvInputs.s.value = s;
        hsvInputs.v.value = v;

        hexInput.value = color.toUpperCase();
    }

    function updateColorFromHSV() {
        const h = parseInt(hsvInputs.h.value) || 0;
        const s = parseInt(hsvInputs.s.value) || 0;
        const v = parseInt(hsvInputs.v.value) || 0;
        const { r, g, b } = hsvToRgb(h, s, v);
        rgbInputs.r.value = r;
        rgbInputs.g.value = g;
        rgbInputs.b.value = b;

        const color = rgbToHex(r, g, b);
        colorPicker.value = color;
        updateColorPreview(color);

        hexInput.value = color.toUpperCase();
    }

    rgbInputs.r.addEventListener('input', updateColorFromInputs);
    rgbInputs.g.addEventListener('input', updateColorFromInputs);
    rgbInputs.b.addEventListener('input', updateColorFromInputs);

    hsvInputs.h.addEventListener('input', updateColorFromHSV);
    hsvInputs.s.addEventListener('input', updateColorFromHSV);
    hsvInputs.v.addEventListener('input', updateColorFromHSV);

    hexInput.addEventListener('input', () => {
        const color = hexInput.value;
