document.addEventListener('DOMContentLoaded', () => {
    const map = document.querySelector('#travel-map');
    if (!map) return;

    const viewport = map.querySelector('.travel-map-viewport');
    const canvas = map.querySelector('.travel-map-canvas');
    const controls = map.querySelector('.travel-map-controls');
    const minScale = 1;
    const maxScale = 3.2;
    let scale = 1;
    let x = 0;
    let y = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const clampPosition = () => {
        const width = canvas.offsetWidth * scale;
        const height = canvas.offsetHeight * scale;
        x = Math.min(0, Math.max(viewport.clientWidth - width, x));
        y = Math.min(0, Math.max(viewport.clientHeight - height, y));
    };

    const render = () => {
        clampPosition();
        canvas.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    };

    const reset = () => {
        scale = Math.max(minScale, viewport.clientWidth / canvas.offsetWidth);
        x = (viewport.clientWidth - canvas.offsetWidth * scale) / 2;
        y = (viewport.clientHeight - canvas.offsetHeight * scale) / 2;
        render();
    };

    const zoomAt = (amount, clientX, clientY) => {
        const rect = viewport.getBoundingClientRect();
        const pointX = clientX - rect.left;
        const pointY = clientY - rect.top;
        const nextScale = Math.min(maxScale, Math.max(minScale, scale * amount));
        const ratio = nextScale / scale;
        x = pointX - (pointX - x) * ratio;
        y = pointY - (pointY - y) * ratio;
        scale = nextScale;
        render();
    };

    viewport.addEventListener('wheel', (event) => {
        event.preventDefault();
        zoomAt(event.deltaY < 0 ? 1.15 : 0.87, event.clientX, event.clientY);
    }, { passive: false });

    viewport.addEventListener('pointerdown', (event) => {
        if (event.target.closest('.map-pin')) return;
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        viewport.classList.add('is-dragging');
        viewport.setPointerCapture(event.pointerId);
    });

    viewport.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        x += event.clientX - lastX;
        y += event.clientY - lastY;
        lastX = event.clientX;
        lastY = event.clientY;
        render();
    });

    const endDrag = () => {
        dragging = false;
        viewport.classList.remove('is-dragging');
    };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    controls.addEventListener('click', (event) => {
        const action = event.target.closest('button')?.dataset.mapAction;
        if (!action) return;
        if (action === 'reset') return reset();
        const rect = viewport.getBoundingClientRect();
        zoomAt(action === 'zoom-in' ? 1.25 : 0.8, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });

    map.querySelectorAll('.map-pin').forEach((pin) => {
        pin.addEventListener('click', () => {
            if (!pin.dataset.target) return;
            map.querySelectorAll('.map-pin').forEach((item) => item.classList.remove('is-active'));
            pin.classList.add('is-active');
            const card = document.getElementById(pin.dataset.target);
            card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            card?.classList.add('is-highlighted');
            window.setTimeout(() => card?.classList.remove('is-highlighted'), 1200);
        });
    });

    window.addEventListener('resize', reset);
    reset();
});
