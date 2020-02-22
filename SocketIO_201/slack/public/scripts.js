const socket = io('http://localhost:9000') //the / namespace-endpoint
// Listen for nsList, whitch is a list of all the namespaces.
socket.on('nsList', (nsData)=>{
  console.log('the list of namespaces has arrived!!')
  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = " ";
  nsData.forEach( (ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}" /></div>`
  });
  // add a click listener for each namespace
  Array.from(document.getElementsByClassName('namespace')).forEach((element)=>{
    element.addEventListener('click', (e)=>{
      const nsEndpoint = element.getAttribute('ns');
      console.log(`I should now go to ${nsEndpoint}`)
      joinNs(nsEndpoint);

    })
  })


})

