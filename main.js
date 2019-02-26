const LINES = 50;
const COLUMNS = 50;

/**
 * Generating an HTML pixel ID based on the X / Y positions
 * /!\ the dash is necessary to avoid symatric duplicates (eg [12, 3] & [1, 23 ])
 * @param {*} x 
 * @param {*} y 
 */
function pixelId(x, y) {
    return x.toString() + '-' + y.toString()
}

/**
 * Add the HTML elements (pixels)
 */
function initTable() {
    let root = document.getElementById('root')

    for (let y = 0; y < LINES; y++) {
        let line = document.createElement('div')
        line.setAttribute('class', 'line')

        for (let x = 0; x < COLUMNS; x++) {
            let pixel = document.createElement('div')
            pixel.setAttribute('class', 'pixel')
            pixel.setAttribute('id', pixelId(x, y))

            line.appendChild(pixel)
        }

        root.appendChild(line)
    }
}

/**
 * Verifies that a pixel exists in the table
 * @param {*} x 
 * @param {*} y 
 */
function exists(x, y) {
    return Boolean(document.getElementById(pixelId(x, y)))
}

/**
 * Update a pixel class to set it VISITED (red)
 * @param {*} x 
 * @param {*} y 
 */
function visit(x, y, color) {

    if (document.getElementById(pixelId(x, y)).classList.contains('visited')) {
        let item = document.createElement('li')
        item.textContent = `The pixel (${x},${y}) is already visited`
        document.getElementById('errors').appendChild(item)
        throw Error(`The pixel (${x},${y}) is already visited`)
    } else {
        pixel = document.getElementById(pixelId(x, y))
        pixel.classList.add('visited')
        pixel.style.backgroundColor = color
    }
}

/**
 * Applies bresengam algorithm from a starting
 * position to a destination
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 */
function bresenham(x1, y1, x2, y2) {
    segments = []

    let delta_x = x2 - x1
    let delta_y = y2 - y1
    
    const_err_x = delta_x === 0 ? 0 : delta_y / delta_x;
    const_err_y = delta_y === 0 ? 0 : delta_x / delta_y;

    x = x1
    y = y1
    err_x = 0.0
    err_y = 0.0
    
    while (x < COLUMNS || y < LINES) {

        if (err_x >= 0.5) {
            x++;
            err_x--;
        }
        
        if (err_y >= 0.5) {
            y++;
            err_y--;
        }

        if (exists(x, y)) {
            visit(x, y, 'red')
            segments.push([x, y])
        } 

        err_x += const_err_x
        err_y += const_err_y
    }

    return segments
}

/**
 * Applies the BRESENHAM algorithm from a starting point
 * to a direction set by an angle (in degres)
 * @param {*} x1 X position of the starting point
 * @param {*} y1 Y position of the starting point
 * @param {*} angle The direction of the ray
 */
function bresenham_angle(x1, y1, degres) {

    const angle = Math.PI * (degres / 180)

    diag = Math.sqrt(LINES ** 2 + COLUMNS ** 2)
    
    x2 = diag * Math.cos(angle)
    y2 = diag * Math.sin(angle)

    return bresenham(x1, y1, x2, y2)
}

/**
 * Set all the pixels to NOT VISITED (blue), to refresh the table
 */
function clear() {
    for (const element of document.getElementsByClassName('pixel')) {
        element.style.backgroundColor = 'blue'
        element.classList.remove('visited')
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

window.onload = (event) => {
    
    initTable()

    /**
     * Added a range input to move in order to see the red ray applied
     * on the table & test the scaning algorithm(s)
     */
    document.getElementById('angle').addEventListener('input', (event) => {
        clear()

        document.getElementById('display').textContent = event.target.value + '°';

        segments = bresenham_angle(0, 0, event.target.value)

        for (let index = 1; index < COLUMNS; index++) {
            rayColor = getRandomColor()
            segments.forEach(pixel => {
                visit(pixel[0] + index, pixel[1], rayColor)
            });
        }
        
    })
}