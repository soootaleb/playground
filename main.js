const LINES = 50;
const COLUMNS = 80;

function initTable() {
    let root = document.getElementById('root')

    for (let y = 0; y < LINES; y++) {
        let line = document.createElement('div')
        line.setAttribute('class', 'line')

        for (let x = 0; x < COLUMNS; x++) {
            let pixel = document.createElement('div')
            pixel.setAttribute('class', 'pixel')
            pixel.setAttribute('id', x.toString() + y.toString())

            line.appendChild(pixel)
        }

        root.appendChild(line)
    }
}

function visit(x, y) {
    document.getElementById(x.toString() + y.toString()).classList.add('visited')
}

function bresenham(x1, y1, x2, y2) {
    let delta_x = x2 - x1
    let delta_y = y2 - y1
    y = y1
    error = 0.0
    if(delta_x != 0) {
        err_x = delta_y / delta_x
    } else {
        err_x = 0
    }

    let err_y = -1

    for (let x = x1; x < x2; x++) {
        
        visit(x, y)

        error += err_x
        if (error >= 0.5) {
            y += 1
            error += err_y   
        }
    }
        
        
}


window.onload = (event) => {
    
    initTable()

    bresenham(0, 0, COLUMNS, LINES)
}