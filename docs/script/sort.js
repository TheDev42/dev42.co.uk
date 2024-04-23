function getColor(gradientSteps, position) {
	position = Math.min(Math.max(0, position), 1)
	const stepKey = Math.floor(position * (gradientSteps.length - 1));
	const stepPosition = (position * (gradientSteps.length - 1)) % 1
	if (stepPosition == 0) return gradientSteps[stepKey]
	return gradientSteps[stepKey].map(
		(value, i) => value * (1-stepPosition) + gradientSteps[stepKey + 1][i] * stepPosition
	)
}
const gradient = [[255,46,96], [164,0,222], [97,0,255]]

// by number they represent
let elements = {}
let values = []
let availableValues = []

const wrapperEl = document.querySelector(".wrapper")

const itemCount = 50
wrapperEl.style.setProperty("--itemcount", itemCount);
for (let i = 0; i < itemCount; i++) {
	const el = document.createElement("div")
	el.classList.add("line")
	el.style.setProperty("--value", i + 1)
	el.style.setProperty("--color", "rgb(" + getColor(gradient, i / itemCount).join(",") + ")")
	wrapperEl.appendChild(el)
	elements[i] = el
}
function shuffle() {
	values = [];
	availableValues = Array(itemCount).fill(0).map((_, i) => i)
	while (availableValues.length > 0) {
		const position = Math.floor(Math.random() * availableValues.length)
		const value = availableValues[position]
		elements[value].style.setProperty("--position", values.length)
		values.push(value)
		availableValues.splice(position, 1)
	}
}
shuffle();



const animSpeed = 0.04
let frame = 0;
let nextFrame = 0;
let state = "reset";

function start() {
	if (state == "reset") {
		dotElement.classList.remove("done")
		state = "sorting"
		upperLimit = itemCount;
		tick();
	} else if (state == "done") {
		state = "reset"
		shuffle();
	}
}
function tick() {
	frame += animSpeed
	while (frame >= nextFrame) {
		nextStep();
		nextFrame += 1 / (upperLimit + 10);
		if (state == "done") return
	}
	requestAnimationFrame(tick);
}

let position = 0;
let changeMade = false;
let highestChange = 0;
let upperLimit = itemCount - 1
let dotElement = document.querySelector(".dot")

function nextStep() {
	if (position + 1 == upperLimit) {
		upperLimit = highestChange
		position = 0;
		if (!changeMade) {
			state = "done";
			dotElement.classList.add("done")
			return
		}
		changeMade = false;
	}
	
	dotElement.style.setProperty("--color", "rgb(" + getColor(gradient, position / itemCount).join(",") + ")")
	dotElement.style.setProperty("--position", position)
	
	let valueA = values[position]
	let valueB = values[position + 1]
	
	if (valueA > valueB) {
		highestChange = position + 1;
		changeMade = true
		values[position] = valueB
		values[position + 1] = valueA
		elements[valueB].style.setProperty("--position", position)
		elements[valueA].style.setProperty("--position", position + 1)
	}
	position++
}

// if the pen is in thumbnail view, start the animation
if (location.pathname.match(/fullcpgrid/i) ? true : false) {
  setTimeout(()=>{document.querySelector(".subtitle").style.display="none"; start()}, 500)
}