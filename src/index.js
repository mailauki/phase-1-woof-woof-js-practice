document.addEventListener("DOMContentLoaded", () => {
  getDogs()

  document.querySelector("#good-dog-filter").addEventListener("click", handleFilter)
})

function getDogs() {
  fetch("http://localhost:3000/pups/")
  .then(res => res.json())
  .then(json => {
    json.forEach(dog => {
      renderList(dog)
    })
  })
}

function handleClick(e) {
  const dogInfo = document.querySelector("#dog-info")

  while (dogInfo.firstChild) {
    dogInfo.removeChild(dogInfo.firstChild)
  }

  fetch(`http://localhost:3000/pups/${e.target.id}`)
  .then(res => res.json())
  .then(dogData => {
    renderDogInfo(dogData)
  })
}

function handleFilter() {
  fetch("http://localhost:3000/pups/")
  .then(res => res.json())
  .then(dogData => {
    filterGoodDogs(dogData)
  })
}

function renderList(dog) {
  const span = document.createElement("span")
  span.append(dog.name)
  span.id = dog.id

  const dogBar = document.querySelector("#dog-bar")
  dogBar.appendChild(span)

  span.addEventListener("click", handleClick)
}

function renderDogInfo(dog) {
  const div = document.createElement("div")
  
  const img = document.createElement("img")
  img.setAttribute("src", dog.image)
  div.appendChild(img)

  const h2 = document.createElement("h2")
  h2.innerText = dog.name
  div.appendChild(h2)

  const btn = document.createElement("button")
  if (dog.isGoodDog === true) {
    btn.innerText = "Good Dog!"
  }
  else {
    btn.innerText = "Bad Dog!"
  }
  div.appendChild(btn)

  btn.addEventListener("click", () => {
    let isGood = false

    if (dog.isGoodDog === false) {
      btn.innerText = "Good Dog!"
      isGood = true
      dog.isGoodDog = true
    }
    else if (dog.isGoodDog === true) {
      btn.innerText = "Bad Dog!"
      isGood = false
      dog.isGoodDog = false
    }
    toggleGoodDog(dog)
  })
  
  document.querySelector("#dog-info").appendChild(div)
  
}

function toggleGoodDog(dog) {
  fetch(`http://localhost:3000/pups/${dog.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      isGoodDog: dog.isGoodDog
    })
  })
  .then(res => res.json)
}

let filterOn = false

function filterGoodDogs(dogs) {
  const filter = document.querySelector("#good-dog-filter")
  if (filterOn === false) {
    filter.innerText = "Filter good dogs: ON"
    dogs.forEach(dog => {
      if (dog.isGoodDog === false) {
        document.querySelector("span").style.display = "none"
      }
    })
    filterOn = true
  }
  else {
    filter.innerText = "Filter good dogs: OFF"
    dogs.forEach(dog => {
      if (dog.isGoodDog === false) {
        document.querySelector("span").style.display = "flex"
      }
    })
    filterOn = false
  }
}
