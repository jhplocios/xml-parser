function h(key, n) {
  const hash = (4*key + 5) % n
  return hash;
}

function h_2(key) {
  const hash = 11 - (key % 11);
  return hash;
}

const key_values = [125, 40, 52, 13, 26, 5, 32, 65, 80, 100, 33, 57, 8]

// key_values.forEach(k => console.log(k, h(k, 103)));
//key_values.forEach(k => console.log(k, h(k, 23), (h(k, 23) + 1)%23, (h(k, 23) + 4)%23, (h(k, 23) + 9)%23))
key_values.forEach(k => console.log(k, h(k, 47), (h(k, 47) + 1)%47, (h(k, 47) + 4)%47, (h(k, 47) + 9)%47))
// key_values.forEach(k => console.log(k, h(k), (h(k) + 1*h_2(k))%23, (h(k) + 2*h_2(k))%23, (h(k) + 3*h_2(k))%23))

// for (let i=1; i<=100; i++) {
//   console.log(i, '=',(i*i % 13) - 1)
// }