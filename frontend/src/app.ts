interface Card {
    id: string;
    name: string;
    type: string;
    rate: string;
    imageURL: string;
    origin: 'habitica' | 'manual';
}

function exibitionCards(list: Card[]) {
    const container = document.getElementById('album');
    if(!container) return;

    container.innerHTML="";

    list.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        cardElement.innerHTML = `
            <h2>${card.name}</h2>
            <img src="${card.imageURL}" alt="${card.name}">
            <p>Type: ${card.type}</p>
            <p>Rate: ${card.rate}</p>
        `;

        container.appendChild(cardElement);

    });
}

async function loadCards() {
    try{
        const response = await fetch('cards.json')
        const data: Card[] = await response.json()
        exibitionCards(data)
    } catch (error) {
        console.warn("Missing cards.json file or Java API...");
    }

}

loadCards();
