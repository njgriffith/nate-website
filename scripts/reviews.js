document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('grid-container');

    const items = [
    { type: 'image', src: '/resources/albums/covers/ants_from_up_there.jpg' },
    { type: 'text', content: 'Ants From Up There' },
    { type: 'text', content: 'Black Country New Road' },
    { type: 'text', content: '10', class: 'score'},
    { type: 'link', content: 'Full Review', href: '/templates/album-review.html?album=ants_from_up_there' },

    { type: 'image', src: '/resources/albums/covers/blood_visions.jpg' },
    { type: 'text', content: 'Blood Visions' },
    { type: 'text', content: 'Jay Reatard' },
    { type: 'text', content: '10', class: 'score' },
    { type: 'link', content: 'Full Review', href: '/templates/album-review.html?album=blood_visions' },

    { type: 'image', src: '/resources/albums/covers/congratulations.jpg' },
    { type: 'text', content: 'Congratulations' },
    { type: 'text', content: 'MGMT' },
    { type: 'text', content: '10', class: 'score' },
    { type: 'link', content: 'Full Review', href: '/templates/album-review.html?album=congratulations' },

    { type: 'image', src: '/resources/albums/covers/girl_with_basket_of_fruit.jpg' },
    { type: 'text', content: 'Girl With Basket of Fruit' },
    { type: 'text', content: 'Xiu Xiu' },
    { type: 'text', content: '10', class: 'score' },
    { type: 'link', content: 'Full Review', href: '/templates/album-review.html?album=girl_with_basket_of_fruit' },

    { type: 'image', src: '/resources/albums/covers/lonesome_crowded_west.jpg' },
    { type: 'text', content: 'The Lonesome Crowded West' },
    { type: 'text', content: 'Modest Mouse' },
    { type: 'text', content: '10', class: 'score' },
    { type: 'link', content: 'Full Review', href: '/templates/album-review.html?album=lonesome_crowded_west' },

    { type: 'image', src: '/resources/albums/covers/skinny_fists.jpg' },
    { type: 'text', content: 'Lift Your Skinny Fists Like Antennas to Heaven' },
    { type: 'text', content: 'Godspeed You! Black Emperor' },
    { type: 'text', content: '10', class: 'score' },
    { type: 'link', content: 'Full Review', href: '/templates/album-review.html?album=skinny_fists' },

    { type: 'image', src: '/resources/albums/covers/STGSTV.jpg' },
    { type: 'text', content: 'Spirit They\'re Gone, Spirit They\'ve Vanished' },
    { type: 'text', content: 'Animal Collective' },
    { type: 'text', content: '10', class: 'score' },
    { type: 'link', content: 'Full Review', href: '/templates/album-review.html?album=STGSTV' },

    { type: 'image', src: '/resources/albums/covers/to_be_kind.jpg' },
    { type: 'text', content: 'To Be Kind' },
    { type: 'text', content: 'Swans' },
    { type: 'text', content: '10', class: 'score' },
    { type: 'link', content: 'Full Review', href: '/templates/album-review.html?album=to_be_kind' },

    { type: 'image', src: '/resources/albums/covers/TPAB.jpg' },
    { type: 'text', content: 'To Pimp a Butterfly' },
    { type: 'text', content: 'Kendrick Lamar' },
    { type: 'text', content: '10', class: 'score' },
    { type: 'link', content: 'Full Review', href: '/templates/album-review.html?album=TPAB' },

    { type: 'image', src: '/resources/albums/covers/TVU&N.jpg' },
    { type: 'text', content: 'The Velvet Underground & Nico' },
    { type: 'text', content: 'The Velvet Underground & Nico' },
    { type: 'text', content: '10', class: 'score' },
    { type: 'link', content: 'Full Review', href: '/templates/album-review.html?album=TVU%26N' }
    ];

    const row = document.createElement('div');
    row.classList.add('grid-row');

    items.forEach((item, index) => {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    
    if (item.type === 'image') {
        const img = document.createElement('img');
        const link = document.createElement('a');
        link.href = items[index+4]['href'];
        link.classList.add('image-link');
        img.src = item.src;
        img.classList.add('cover');
        link.appendChild(img);
        gridItem.appendChild(link);
    } else if (item.type === 'text') {
        const text = document.createElement('p');
        text.textContent = item.content;
        gridItem.appendChild(text);
    } else if (item.type === 'link') {
        const link = document.createElement('a');
        link.classList.add('text-link');
        link.href = item.href;
        link.textContent = item.content;
        gridItem.appendChild(link);
    }
    gridContainer.appendChild(gridItem);
    });
});
