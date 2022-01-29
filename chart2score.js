const brain = require('brain.js')

const config = {
    binaryThresh: 0.5,
    hiddenLayers: [20], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    // leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
}

const net = new brain.NeuralNetwork(config);

net.train([
    { input: normalnums([10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10, 0, 0, 0, 0, 0, 0,40]), output: [1] },
    { input: normalnums([10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10, 0, 5, 7,20,30,35,40]), output: [.8] },
    { input: normalnums([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10,10,10,10,10,10,10,10,10,10,10, 0, 2, 3,10, 2,17,20]), output: [.8] },
    { input: normalnums([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,30,29,30,36,38,26, 7]), output: [1] },
    { input: normalnums([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,15,20,26,26,27,29,31,33,38,40,33,11]), output: [1] },
    { input: normalnums([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,40,36,34,36,35,28,31,35,31,27,29,28,22,13]), output: [1] },
    { input: normalnums([10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,40,40,40,40,40,40,40]), output: [0] },
    { input: normalnums([10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]), output: [0] },
])

// console.log(net.run(normalnums([0,0,0,0,0,0,0,9,9,9])))
// console.log(net.run(normalnums([5,3,5,3,5,4,5,9,9,9])))
// console.log(net.run(normalnums([9,9,9,9,9,9,9,9,9,9])))
// console.log(net.run(normalnums([5,5,5,5,5,5,5,5,5,5])))
// console.log(net.run(normalnums([5,3,5,3,5,4,5,0,0,0])))

function normalnums(arr) { return arr.map( x => x/40 ) }

module.exports.default = (nums) => {
    return +net.run(normalnums(nums))
}
