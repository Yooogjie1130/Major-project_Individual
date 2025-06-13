# Major-project_Individual
 How to Interact with the Project
Once the page loads, a background image (Mondrian's artwork) is automatically transformed into a pixelated grid canvas.
There are two "snakes" on the screen:
One is driven by Perlin noise (a green circular snake).
The other is controlled by a random walk algorithm (a red square snake).
Use the slider at the bottom right to adjust the snake speed (range: 1 to 50).
Click the “Restart” button to reset both snakes to their starting positions.
When the two snakes collide, the winner is displayed based on their length (longer wins; if equal, it’s a tie).
![Random Snake Win](./assets/Random_snake_win_.png)

 My Personal Animation Approach
Building on the group’s base code, I designed a dual-snake competitive system:
One snake uses Perlin noise for smoother, more natural movement.
The other uses an improved random walk with directional control (simulating momentum).
 Both snakes move across the canvas, "eat" colored pixels, and grow or shrink accordingly.

Code techniques
I chose Perlin noise (for snake1) and Random Walk (for snake2) as the core motion drivers.
These two algorithms offer a contrast between:
The organic and continuous path of Perlin noise,
Versus the chaotic yet guided movement of a random walk with memory (momentum).
The image is pixelated into individual Dot objects.
Each dot is sized based on its brightness value, recreating a Mondrian-style artwork.
When a snake eats red dots, it grows longer; blue dots, it becomes shorter.
What makes my animation different is the competitive snake interaction and color-recognition-based logic—this goes beyond simple motion and introduces a rule-based game dynamic.

Inspiration
The main inspiration is Mondrian’s Broadway Boogie Woogie.
I wanted to simulate “lines moving through a city,” like traffic and rhythm in an urban grid.
I was also inspired by classic Snake games and generative art, aiming to create a sense of “rhythmic chaos” using algorithmic movement.

Technical Overview
The pixel grid is generated using get() and resize(), then brightness is mapped to size using map().
The Dot class has a checkIfEaten() method that detects proximity between a snake’s head and each dot.
Snake positions are stored using createVector() and updated frame by frame.
let start1 = createVector(dots[0].x, dots[0].y);
let start2 = createVector(width - 20, height - 20);
The Perlin snake uses noise (noiseOffset) to determine direction, incrementing offset for smooth flow.
The random walker updates direction with slight changes to lastAngle, simulating inertia.

Modifications to the Group Code
Added a second snake (snake2) with its own movement logic.
Implemented win condition logic and a gameOver state.
Increased the default snake length and speed for more dynamic interaction.


External Tools or Resources Used
Used createVector(), map(), and noise() from p5.js library.
Key references:
p5.js reference


GeeksForGeeks: p5.js createVector




