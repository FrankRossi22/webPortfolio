import './App.css';
import './banner.css';

function Banner() {

  return (
      <div className={'bannerBackground'} tabIndex={0}>
      <div className='banner'>
        <a id='top' href='#topScreen'><p></p></a>
        <div className='bannerFlex'>
          <div className='bannerPicture'><img src='./images/me.png' alt='Frank Rossi'/></div> 
          <div className='aboutMe'>
            <h1>Frank Rossi</h1>
            <p>Senior CSE Student at The Ohio State University</p>            
          </div>
        </div>
        <br />
      </div>
      </div>
  ); 
}
export default Banner;
