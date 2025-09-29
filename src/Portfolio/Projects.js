import './projects.css';

import React from 'react';
function Projects({elRef, screenSize}) {
  function Project({ name, createdWith, description, image, id, links }) {
    var createdWithLis = [];
    for(var i = 0; i < createdWith.length; i++) {
      createdWithLis.push(<React.Fragment key={'projLI' + id + i}><li><img src={createdWith[i].src} style={createdWith[i].myStyle} alt={createdWith[i].iconName} /></li></React.Fragment>)
    }
    var linkAs = [];
    for(i = 0; i < links.length; i++) {
      linkAs.push(<React.Fragment key={'ProjLink' + id + i}><a className='projectLink' href={links[i].link}><p> <img src={links[i].icon} alt={links[i].name}/>{links[i].name}</p></a></React.Fragment>)
    }
    var projImage = null;
    if(screenSize >= 850 ) {
      projImage = 
      <div className='projectImage'>
        <img src={image} alt={name + ' Site'}></img>
      </div>;
    }
    return (
      <div className='projectsFlex' >
        <div className='projectFiller'></div>
        <div className='projectDiv'>
          <div className='projectDescription'>
            <h3>{name}</h3>
            <div className='projectCreatedWith'>
              <p>Created With:</p>
              <ul className='projectCreatedUL'>
                {createdWithLis}
              </ul>
            </div>
            <p className='projectDescP'>{description}</p>
            <div className='projectLinks'>{linkAs}</div>
            </div>
          {projImage}
        </div>
        <div className='projectFiller'></div>
        
      </div>
    );
  }

  const lunchCountMadeWith = [
    { myStyle: {width: 30, height: 30 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", iconName: 'JS'},
    { myStyle: {width: 40, height: 40 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg", iconName: 'Node JS'},
    { myStyle: {width: 40, height: 40 }, src: "./images/nedB.png", iconName: 'NeDB'},
    { myStyle: {width: 70, height: 70 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original-wordmark.svg", iconName: 'Express'}
  ]
  const bajaMadeWith = [
    { myStyle: {width: 40, height: 40 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", iconName: 'Python'},
    { myStyle: {width: 40, height: 40 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/arduino/arduino-original-wordmark.svg", iconName: 'Arduino'},
    { myStyle: {width: 40, height: 40 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/raspberrypi/raspberrypi-original.svg", iconName: 'RasPi'},
  ]

  const sortingMadeWith = [
    { myStyle: {width: 30, height: 30 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", iconName: 'JS'},
    { myStyle: {width: 40, height: 40 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original-wordmark.svg", iconName: 'REACT'},
    { myStyle: {width: 40, height: 40 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original-wordmark.svg", iconName: 'HTML'},
    { myStyle: {width: 40, height: 40 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original-wordmark.svg", iconName: 'CSS'}
  ]

  const gameMadeWith = [
    { myStyle: {width: 30, height: 30 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", iconName: 'JS'},
    { myStyle: {width: 40, height: 40 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original-wordmark.svg", iconName: 'HTML'},
    { myStyle: {width: 40, height: 40 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original-wordmark.svg", iconName: 'CSS'}
  ]
  const listMadeWith = [
    { myStyle: {width: 30, height: 30 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original-wordmark.svg", iconName: 'Java'},
    { myStyle: {width: 30, height: 30 }, src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/junit/junit-plain-wordmark.svg", iconName: 'JUnit'},
  ]
  return (
    <section className="projects" id='projects'>
      <h2 ref={ elRef }>Projects</h2>
      <Project name='Mobile Side Scroller Game' createdWith={gameMadeWith} id={'MSSG'} links={[
          {link: '/gamePage', icon: './images/play-button.png', name: 'Demo'},
          {link: 'https://github.com/FrankRossi22/SimpleJSGame', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', name: 'GitHub'}
        ]}
        description={"A side scroller base defense game made with the canvas element in HTML and JavaScript. " 
          + "Players must defend the relic in their base while fighting alongside friendly AI against hordes of enemies. "
          + "Made to be mechanically similar to Plants vs. Zombies with more combat oriented gameplay"
        } 
        image={"./images/gameImage.png"}/>

      <Project name='Lunch Count' createdWith={lunchCountMadeWith} id={'LC'} links={[
          {link: 'https://github.com/FrankRossi22/LunchCount2024', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', name: 'GitHub'},
        ]}
        description={"With the large growth of Learning Management Systems over the past decade, " 
          + "Lunch Count serves as a building block to improve these platforms by providing a robust system for tracking student lunch orders. "
          + "Users (Students, Teachers, and Admin) each have their own dashboard with admin having sole access to lunch creation and updating. This was created using JS, Express, and NedB Databases."} 
        image={"./images/lunchCount.png"}/>

      <Project name='Baja Buckeyes' createdWith={bajaMadeWith} id={'BB'} links={[
          {link: 'https://osubajasae.wixsite.com/bajabuckeyes', icon: './images/bajaIcon.webp', name: 'Baja'},
          {link: 'https://github.com/FrankRossi22/ArduinoProjects', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', name: 'GitHub'}      
        ]}
        description={"Sensor code and testing built by the Data Aquisition sub-team of the Baja Buckeyes." 
          + " Baja Buckeyes is a student organization that designs, builds, and competes an offroad vehicle each year, as a part of Baja SAE."
          + " The DAQ sub-team focuses on working with other sub-teams to create testing programs for their elements of the vehicle." 
          + " This year the team placed 12/61 and 31/107 at Baja SAE California & Pennsylvania respectively."
        } 
        image={"./images/baja.png"}/>

      <Project name='Doubly Linked List' createdWith={listMadeWith} id={'DLL'} links={[
          {link: 'https://github.com/FrankRossi22/DoublyLinkedList/', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', name: 'GitHub'}      
        
          ]}
        description={"Implementation of a Doubly Linked List in Java. "
          + "Created using OSU's list library and OOP. "
          + "I have many other datatypes and projects centered around OOP in Java, but I am restricted from posting code from OSU classes on Github. "
          + "However, feel free to contact me for more examples of my work in Java!"
        } 
        image={"./images/doublyLinkedList.png"}/>

      <Project name='Sorting Algorithm Visualizer' createdWith={sortingMadeWith} id={'SAV'} links={[
          {link: '/sortingVisualizer', icon: './images/play-button.png', name: 'Demo'},
          {link: 'https://github.com/FrankRossi22/SortingAlgVisualizer', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', name: 'GitHub'}      
        
          ]}
        description={"Small Project to visualize how sorting algorithms work throughout the sorting process. "
          + "Originally created using HTML Canvas and JavaScript, then updated for the demo version to work with canvas in React. "
          + "Users can go through the visualizations at 1 or up to 100 frames per second."
        } 
        image={"./images/sortingVisImage.png"}/>
  
    </section>
  );
}

export default Projects;
