document.addEventListener('DOMContentLoaded', () => {
    const map = document.querySelector('#travel-map');
    if (!map) return;

    const viewport = map.querySelector('.travel-map-viewport');
    const canvas = map.querySelector('.travel-map-canvas');
    const controls = map.querySelector('.travel-map-controls');
    const popup = map.querySelector('.map-guide-popup');
    const popupContent = popup.querySelector('.map-guide-content');
    const minScale = 1;
    const maxScale = 4;
    let scale = 1;
    let x = 0;
    let y = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const project = ([longitude, latitude]) => [
        ((longitude + 180) / 360) * 1200,
        ((90 - latitude) / 180) * 600
    ];

    const ringToPath = (ring) => {
        let previousLongitude = null;
        return ring.map((coordinate, index) => {
            const [pointX, pointY] = project(coordinate);
            const crossesDateLine = previousLongitude !== null && Math.abs(coordinate[0] - previousLongitude) > 180;
            previousLongitude = coordinate[0];
            return `${index === 0 || crossesDateLine ? 'M' : 'L'}${pointX.toFixed(2)},${pointY.toFixed(2)}`;
        }).join(' ') + ' Z';
    };

    const geometryToPath = (geometry) => {
        const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
        return polygons.map((polygon) => polygon.map(ringToPath).join(' ')).join(' ');
    };

    const drawMap = async () => {
        const countries = map.querySelector('.map-countries');
        const graticule = map.querySelector('.map-graticule');
        for (let longitude = -150; longitude <= 150; longitude += 30) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${project([longitude, -85]).join(',')} L${project([longitude, 85]).join(',')}`);
            graticule.appendChild(path);
        }
        for (let latitude = -60; latitude <= 60; latitude += 30) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${project([-180, latitude]).join(',')} L${project([180, latitude]).join(',')}`);
            graticule.appendChild(path);
        }
        try {
            const response = await fetch('../assets/ne_110m_admin_0_countries.geojson');
            if (!response.ok) throw new Error(`Map data returned ${response.status}`);
            const data = await response.json();
            data.features.forEach((feature) => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', geometryToPath(feature.geometry));
                countries.appendChild(path);
            });
        } catch (error) {
            console.error('The travel map could not be drawn.', error);
        }
    };

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

    const closePopup = () => {
        popup.classList.remove('is-open');
        popup.setAttribute('aria-hidden', 'true');
        map.querySelectorAll('.map-pin').forEach((pin) => pin.classList.remove('is-active'));
    };

    const openGuide = (pin) => {
        map.querySelectorAll('.map-pin').forEach((item) => item.classList.remove('is-active'));
        pin.classList.add('is-active');
        if (pin.dataset.target) {
            const card = document.getElementById(pin.dataset.target);
            popupContent.replaceChildren(...Array.from(card.children).map((child) => child.cloneNode(true)));
        } else {
            const place = pin.querySelector('span').textContent;
            popupContent.innerHTML = `<div class="map-childhood-note"><p class="travel-date">childhood log</p><h3>${place}</h3><p>I’ve been here, but the photos and recommendations are still tucked away in childhood memories.</p></div>`;
        }
        popup.classList.add('is-open');
        popup.setAttribute('aria-hidden', 'false');
    };

    const organiseGuides = () => {
        const grid = document.querySelector('.travel-card-grid');
        const groups = {
            'North America': ['regina', 'vancouver', 'honolulu', 'palo-alto', 'carmel', 'yosemite', 'san-francisco'],
            'South America': ['buenos-aires'],
            'Europe': ['paris', 'marseille', 'london', 'stratford'],
            'Asia': ['tokyo', 'naha']
        };
        Object.entries(groups).forEach(([continent, ids]) => {
            const section = document.createElement('section');
            section.className = 'continent-guide-group';
            section.innerHTML = `<h3 class="continent-guide-title">${continent}</h3><div class="continent-guide-list"></div>`;
            const list = section.querySelector('.continent-guide-list');
            ids.forEach((id) => {
                const card = document.getElementById(id);
                const details = document.createElement('details');
                details.className = 'travel-guide';
                const name = card.querySelector('h3').textContent;
                const date = card.querySelector('.travel-date').textContent;
                details.innerHTML = `<summary><span class="travel-guide-name">${name}</span><span class="travel-guide-date">${date}</span></summary>`;
                details.appendChild(card);
                list.appendChild(details);
            });
            grid.appendChild(section);
        });
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

    map.querySelectorAll('.map-pin').forEach((pin) => pin.addEventListener('click', () => openGuide(pin)));
    popup.querySelector('.map-guide-close').addEventListener('click', closePopup);
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closePopup(); });
    window.addEventListener('resize', reset);

    organiseGuides();
    drawMap();
    reset();
});
