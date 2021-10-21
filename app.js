// API 

let isFetching = false
let accessToken
let tracksContainer = document.querySelector('.cartes')
let button = document.querySelector('.reload')
let cards = [];


// *************************************Mise en place le L API
const getUrlParameter = (sParam) => {
  let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
      sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
      sParameterName,
      i;
  let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
  sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
  }
};

const auth = () => {
  accessToken = getUrlParameter('access_token');
  let client_id = ""
  let redirect_uri = "http://localhost:5500/swiperAPI/"

  const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
  // Don't authorize if we have an access token already
  if (accessToken == null || accessToken == "" || accessToken == undefined) {
    window.location.replace(redirect);
  }
};

auth()
// *************************************Mise en place le L API
  

const getRecommandations = async () => {

    console.log('isFetching', isFetching)
    if (isFetching) return
    isFetching = true
    
    tracksContainer.innerHTML = ''
  
    const params = {
      params: {
        limit: 9,
        market: 'FR',
        popularity: '85',
        seed_genres: 'rock'
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
  }
    const response = await axios.get("https://api.spotify.com/v1/recommendations", params);
    const recommendations = response.data

    isFetching = false
    console.log('isFetching', isFetching)
    recommendations.tracks.forEach((track) => {
      createTrack(track)
    })
    
    init()
  };

  const createTrack = (track) => {
      
    const el = document.createElement('div')
    el.classList.add('carte')
  
    const album = track.album
    const artists = track.artists.map((artist) => {
      return artist.name
    })
  
    const audio = track.preview_url?`<audio controls="true" class="track_audio" src="${track.preview_url}"></audio>`: ''
    


    const inner = /*html*/`
      
      <div class="track__album">
      
        <img src="${album.images[0].url}" alt="">
      </div>
      <div class="track__infos">
        <p class="name">${track.name}</p>
  
        <div class="artists">${artists}</div>
        ${audio}
      </div>
    `
  
    el.innerHTML = inner
  
    tracksContainer.append(el)
    cards.push(el)

    
  
  }





// CARTES

const btnPrev = document.querySelector('.fleche--prev')
const btnNext = document.querySelector('.fleche--next')
let currentCardIndex = 0

const init = () => {

    const nbCards = cards.length - 1
    cards.forEach((card, i) => {

    // On applique la class active au premier item du tableau
    if (i === currentCardIndex) card.classList.add('active')

    // On stock si l'index et pair ou impar
    const isEven = i % 2 === 0
    // On créé un multiplicateur positif ou negatif
    const mult = (isEven ? 1 : -1)

    const spaceX = (0.6 * Math.random() * mult) + 4
    const spaceY = (Math.random() * mult) + 2
    
    const offsetX = `${i * spaceX}px`
    const offsetY = `${i * spaceY}px`
    
    card.style.setProperty('--offsetX', offsetX)
    card.style.setProperty('--offsetY', offsetY)

    const z = nbCards - i
    card.style.setProperty('--zIndex', z)


    //Rotation
    const rotationX = (i + 1) * Math.PI * 0.5
    card.style.setProperty('--rotationX', `${rotationX}deg`)

    card.style.setProperty('--left', '50%')

  })
}


const goNextCard = (isNext) => {
  if (currentCardIndex === cards.length) {
    init() 
    return
  };

  const activeCard = cards[currentCardIndex]

  const left = isNext ? 80 : 20
  activeCard.style.setProperty('--left', `${left}%`)

  const mult = Math.random() > 0.5 ? 1 : -1
  const rotationX = Math.random() * 3 * mult 
  activeCard.style.setProperty('--rotationX', `${rotationX}deg`)

  currentCardIndex += 1

  activeCard.style.setProperty('--zIndex', cards.length + currentCardIndex)
}

const addListeners = () => {
  btnPrev.addEventListener('click', () => {
    goNextCard(false)
  })
  btnNext.addEventListener('click', () => {
    goNextCard(true)
  })
}

addListeners();


if (accessToken) {
    getRecommandations()
     const btn = document.querySelector('.reload')
     console.log(btn);
     btn.addEventListener('click', getRecommandations())
  }


