const KEY_API = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=Gjnp8mZOl9hCkgzxsWc2xc7fGlgYzAjT`;

const postsDiv = document.getElementById('posts');
const searchingInput = document.getElementById('searching');
const countrySelect = document.getElementById('country-select');
const searchButton = document.getElementById('search-btn');
const pageNumbers = document.getElementById('pageNumbers');


let allEvents = [];
let sf = [];
let totalPages = 1;
let currentPage = 1;

let postsPerPage;
postsPerPage = 16;
let MAX_PAGE_BUTTONS = 63;
async function adjustForScreenWidth() {
    try {
        if (window.innerWidth < 600) {
            MAX_PAGE_BUTTONS = 50;
            postsPerPage = 20;

            localStorage.setItem('postsPerPage', postsPerPage);
            localStorage.setItem('MAX_PAGE_BUTTONS', MAX_PAGE_BUTTONS);
        }
        if (window.innerWidth <= 1000 && screen.width > 600) {
            console.log("ernfi");
            MAX_PAGE_BUTTONS = 48;
            postsPerPage = 21;
            localStorage.setItem('postsPerPage', postsPerPage);
            localStorage.setItem('MAX_PAGE_BUTTONS', MAX_PAGE_BUTTONS);
        }
        localStorage.getItem('postsPerPage', postsPerPage);
        localStorage.getItem('MAX_PAGE_BUTTONS', MAX_PAGE_BUTTONS);
    } catch (e) {
        console.error('Error retrieving from localStorage', e);
    }
}

async function searchfilms(page = 1, search = '', country = '') {
    try {
        adjustForScreenWidth();
        const pageIndex = Math.max(0, page - 1);

        let url = `${KEY_API}&size=${postsPerPage}&page=${pageIndex}`;

        if (search) {
            url += `&keyword=${encodeURIComponent(search)}`;
        }
        if (country) {
            url += `&countryCode=${country}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        const events = data._embedded?.events || [];
        const tp = data.page?.totalPages || 1;

        return { events, totalPages: tp };
    } catch (err) {
        console.error('Помилка завантаження даних:', err);
        return { events: [], totalPages: 1 };
    }
}

function renderEvents(eventsToRender) {
    postsDiv.innerHTML = '';

    if (eventsToRender.length === 0) {
        postsDiv.innerHTML = '<p>Події не знайдені.</p>';
        return;
    }

    eventsToRender.forEach(event => {
        const post = document.createElement('div');
        post.classList.add('post');

        const imageUrl = event.images?.[7]?.url || 'placeholder.jpg';
        const localDate = event.dates?.start?.localDate || 'Дата невідома';
        const timezone = event._embedded?.venues?.[0]?.timezone || 'Часовий пояс невідомий';

        post.innerHTML = `
            <div class="background-icon"></div>
            <img class="post-img" src="${imageUrl}" alt="${event.name}" width="190px" height="200px"/>
            <h2 class="post-title">${event.name}</h2>
            <p class="post-date">${localDate}</p>
            <p class="location">${timezone}</p>`;

        postsDiv.appendChild(post);

        openModal(post, event);
    });
}

function openModal(post, eventData) {
    const imageUrl = eventData.images?.[6]?.url || 'placeholder.jpg';

    post.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.classList.add('modal');

        let info = eventData.info;

        if (!info) {
            info = "No additional information available or info missing.";
        }

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <div class="flex-box">
                    <div class="main-imaege">
                        <img src='${imageUrl}' alt='main-logo' width='300px' height='400px'/>
                    </div>
                    <div> 
                        <h2>${info}</h2> 
                        <p class="time">${eventData.dates.start.localDate || 'Дата невідома'}</p>
                        <p class="place">${eventData._embedded?.venues?.[0]?.timezone || 'Часовий пояс невідомий'}</p>
                        <p class="teames">${eventData.name || 'Назва відсутня'}</p>
                        <p class="prices">Standart 300-500 UAH</p> 
                        <button class="buy">BUY TICKETS</button>
                        <p class="prices-VIP">VIP 1000-1500 UAH</p>
                        <button class="buy-VIP">BUY TICKETS</button>
                    </div>
                </div>
                <a href="https://www.ticketmaster.com/minnesota-timberwolves-tickets/artist/805971"><button class="more">MORE FROM THIS AUTHOR</button></a>
            </div>`;

        const imageDiv = document.createElement('div');
        imageDiv.classList.add('modal-Image');
        imageDiv.style.backgroundImage = `url(${imageUrl})`;
        modal.querySelector('.modal-content').prepend(imageDiv);


        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.remove("show");
            setTimeout(() => document.body.removeChild(modal), 300);
        });

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add("show"), 10);

        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove("show");
                setTimeout(() => modal.remove(), 300);
            }

        });
        getButtonsFromModal(modal);
    });

}



function getButtonsFromModal(modal) {
    let buttons = modal.querySelectorAll('button');
    let modal_Con = modal.querySelector('.modal-content');
    buttons.forEach(button => {

        let price;

        if (button.classList == 'buy') {
            console.log(button)
            button.addEventListener('click', () => {
                price = modal.querySelector('.prices').textContent
                clickBuyButtons(price,modal)
                modal.classList.remove("show");
            });
        }
       else if (button.classList == 'buy-VIP') {
                    button.addEventListener('click', () => {
            price = modal.querySelector('.prices-VIP').textContent
            clickBuyButtons(price,modal)
            modal.classList.remove("show");
                    });
        }
    })
    console.log(buttons, modal.querySelector('.prices'));
    return buttons;
}

function clickBuyButtons(price,modal) {
    let modal_buy_tickets = document.createElement('div')
    modal_buy_tickets.classList.add('modal_buy_tickets')

    modal_buy_tickets.innerHTML = `
    <div class = "modal-Content">
    <h1>Payment</h1>
    <span class="close-button">&times;</span>
    <div class="price">
    <p>PRICE
    <br>
    ~${price}~</p>
    </div>
    <div class = "info">
    <h3 class="card_Code">Enter your card number</h3>
    <input id="cardCode" type="text" placeholder="Enter info...">
    <br>
    <h3 class="card_Cvv2">Enter CVV2</h3>
    <input id="card_Cvv2" type="text" placeholder="Enter info...">
    <br>
    <div class="pay_button">
    <button id="Pay">Pay</button>
    </div>
    </div>
    </div>
    `
    modal_buy_tickets.classList.add('show');
    console.log(modal_buy_tickets)

    document.body.append(modal_buy_tickets)

        modal_buy_tickets.querySelector('.close-button').addEventListener('click',()=>{
         modal_buy_tickets.classList.remove('show');   
         setTimeout(() => document.body.removeChild(modal_buy_tickets), 300);
         modal.classList.add('show')
    })

let endTransaction = false;

let inp_Card;
let inp_CVV2;
let arrNums = '0123456789';
document.addEventListener('input',()=>{
    inp_Card = modal_buy_tickets.querySelector('#cardCode').value;
    inp_CVV2 = modal_buy_tickets.querySelector('#card_Cvv2').value;

    let bool = null;
    let bool2 = null;
    let leng = inp_Card.split('');
    let leng2 = inp_CVV2.split('')

    console.log(arrNums)
    
    for(let i = 0; i<leng.length; i++){
        if(arrNums.includes(leng[i]))
            bool=true
        else
            bool = false
    }
     for(let i = 0; i<leng2.length; i++){
        if(arrNums.includes(leng2[i]))
            bool2=true
        else
            bool2 = false
    }
    modal_buy_tickets.querySelector("#Pay").addEventListener('click',()=>{
    if(Number(inp_Card)!==NaN && leng.length==16&&bool){
        bool = true
        if(leng2.length==3&&bool2){
        console.log(leng,bool,leng2,bool2)
        modal_buy_tickets.querySelector('.modal-Content').innerHTML = `<h1>Good!</h1>`

        }
    }
    else{
        modal_buy_tickets.querySelector('.modal-Content').innerHTML = `<h1 style ="color:red;">Error!</h1>`
    }
            
    })

    if(modal_buy_tickets.querySelector('.modal-Content').innerHTML !== ``){
endTransaction = true;
    }
            modal_buy_tickets.addEventListener('click', e => {
            if (e.target === modal_buy_tickets) {
                document.body.removeChild(modal_buy_tickets);
                setTimeout(() => modal.remove(), 300);
            }

        })

})



    function closeBuytickets() {
    }
    closeBuytickets()
}




function loadPage(i) {
    const searchText = searchingInput.value.toLowerCase().trim();
    const selectedCountryCode = countrySelect.value.toUpperCase();

    Array.from(pageNumbers.querySelectorAll('.page-btn')).forEach(b => b.classList.add('disabled'));

    searchfilms(i, searchText, selectedCountryCode).then(data => {
        sf = data.events;
        totalPages = data.totalPages;
        currentPage = i;

        renderEvents(sf);
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }).catch(err => {
        console.error('Error loading page', err);
    }).finally(() => {
        Array.from(pageNumbers.querySelectorAll('.page-btn')).forEach(b => b.classList.remove('disabled'));
    });
}

function filterEvents() {
    currentPage = 1;
    loadPage(currentPage);
}


function renderPagination() {
    pageNumbers.innerHTML = "";




    const pagesCount = Math.min(Number(totalPages) || 1, MAX_PAGE_BUTTONS);
    pageNumbers.innerHTML = "";
    if (pagesCount <= 1) return;

    const visible = 5;
    let start = Math.max(1, currentPage - Math.floor(visible / 2));
    let end = start + visible - 1;
    if (end > pagesCount) {
        end = pagesCount;
        start = Math.max(1, end - visible + 1);
    }

    function makePageButton(i) {
        const page = document.createElement('div');
        page.textContent = i;
        page.classList.add('page-btn');
        if (i === currentPage) {
            page.classList.add('placed')
        }
        page.addEventListener('click', () => {
            loadPage(i)
        });
        return page;
    }

    function appendEllipsis() {
        const span = document.createElement('span');
        span.className = 'ellipsis';
        span.textContent = '…';
        span.style.color = '#fff';
        pageNumbers.appendChild(span);

    }

    if (start > 1) {
        pageNumbers.appendChild(makePageButton(1));
        if (start > 2) appendEllipsis();
    }

    for (let i = start; i <= end; i++) {
        pageNumbers.appendChild(makePageButton(i));
    }

    if (end < pagesCount) {
        if (end < pagesCount - 1) appendEllipsis();
        pageNumbers.appendChild(makePageButton(pagesCount));
    }
}

searchfilms(1).then(data => {
    sf = data.events;
    totalPages = data.totalPages;
    renderEvents(sf);
    renderPagination();
});

searchButton.addEventListener('click', () => {
    filterEvents()
    searchingInput.value = ``;
});
countrySelect.addEventListener('change', () => {

    filterEvents()
});

countrySelect.addEventListener('click', () => {
    let arrow = document.querySelector('.arrow');
    arrow.style.rotate = arrow.style.rotate === '180deg' ? '0deg' : '180deg';
});


