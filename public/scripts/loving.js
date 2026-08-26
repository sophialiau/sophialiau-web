document.addEventListener('DOMContentLoaded', () => {
    const field = document.querySelector('.loving-field');
    if (!field) return;

    const loves = [
        'summer fridays pink sugar', 'fresh flowers', 'passionfruit', 'long showers',
        'l’oréal telescopic waterproof', 'pinterest', 'disgustingly obsessive', 'sofia coppola',
        'a good vongole', 'ethel cain', 'biomedical engineering WITH a minor in commerce',
        'octobuddy print', 'ouai saint barts', 'milo, my dog', 'moody lighting for studying',
        'honey dijon chips + aged white cheddar + olives + balsamic',
        'attempting to quantify non quantifiable things', 'marie antoinette', 'funky winker beans',
        'pink sparkly flask', 'i think about it all the time', 'cosmopolitans', 'kismet',
        'charlotte tilbury pillowtalk', 'balsamic vinegar glaze', 'dancing in public',
        'the feeling of going into a jaybird class when it’s rainy outside',
        'zadig & voltaire rock mini', 'impractical dressing', 'kale', 'paper bag — fiona apple',
        'forever working on my personal website', 'sofia coppola films', 'pumpkin spice', 'walks',
        'chanel chance', 'beautiful but painful shoes', 'rhubarb',
        'joe and the juice tunacado + green shield + sauv blanc pre-flight ritual',
        'heated pilates classes', 'weird commit messages', 'retired dancer', 'sex and the city',
        'oddfish', 'calling my bar shelf a bar cart', 'talking',
        'one coat opi bubble bath + one coat opi love is in the bare', 'excel sheets',
        'writing love letters', 'dinner parties', 'crispy sauv blanc', 'lana del rey',
        'top right corner mat in workout classes', 'grand allegro', 'monthly playlists',
        'sticky notes', 'baking & cooking for friends', 'time lapses', 'gold',
        'my mother’s herb garden', 'peonies', 'pinstripe', 'vanilla absolut',
        'fashion killa — a$ap rocky', 'stress cleaning', 'lace', 'spritz o’clock', 'swans',
        'the necklace i always wear (iykyk)', 'brown eyeliner',
        'idk bc i’m an engineer but not that kind', 'ordering sushi in',
        'grocery shopping as an activity', 'double shot espresso + cinnamon on ice',
        'hey girlie pop', 'fun drinkities', 'pumpkin muffins by the novice chef', 'mini skirts',
        'no bc i feel so deeply!', 'dnd 24/7', 'pink', 'hugo spritzes', 'fashion',
        'heirloom tomatoes'
    ];

    const quoted = new Set([
        'retired dancer', 'idk bc i’m an engineer but not that kind',
        'hey girlie pop', 'no bc i feel so deeply!'
    ]);
    const anchors = new Set([
        'fresh flowers', 'sofia coppola', 'milo, my dog', 'kismet', 'cosmopolitans',
        'impractical dressing', 'rhubarb', 'writing love letters', 'grand allegro',
        'peonies', 'pink', 'fashion', 'swans'
    ]);

    const hash = (text) => Array.from(text).reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 7);
    const styles = ['is-note', 'is-pink', 'is-whisper', 'is-underline', 'is-navy'];
    const starColors = [3, 4, 5, 6];

    loves.forEach((love, index) => {
        if (index > 0 && index % 13 === 0) {
            const star = document.createElement('img');
            star.className = 'love-star';
            star.src = `../assets/stars/${starColors[index % starColors.length]}.png`;
            star.alt = '';
            star.style.setProperty('--turn', `${(index % 2 ? -1 : 1) * (4 + index % 7)}deg`);
            field.appendChild(star);
        }

        const thought = document.createElement('span');
        const seed = hash(love);
        const long = love.length > 38;
        const span = long ? 5 + (seed % 3) : 2 + (seed % 3);
        thought.className = `love-thought ${anchors.has(love) ? 'is-script' : styles[seed % styles.length]}${quoted.has(love) ? ' is-quote' : ''}${long ? ' is-wide' : ''}`;
        thought.textContent = love;
        thought.style.gridColumn = `span ${span}`;
        thought.style.gridRow = `span ${long ? 2 : 1}`;
        thought.style.setProperty('--mobile-span', long ? 6 : 3);
        thought.style.setProperty('--turn', `${((seed % 9) - 4) * .55}deg`);
        field.appendChild(thought);
    });
});
