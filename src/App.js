import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RotateLoader from "react-spinners/RotateLoader";

function App() {
  const [images, setImages] = useState(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const surpriseOptions = [
    'A flaming guitar flying through the sky',
    'Batman teaching a class in mathematics',
    'A banana riding a bike through New York',
    'A ghost on a summer holiday',
    'Dog drinking a cocktail while driving a car'
  ]

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      getImages();
    }
  }

  const getImages = async () => {
    setImages(null);
    setError(null);
    if (value === '') {
      setError('Error! No Search Description Detected');
      return;
    }
    setLoading(true);
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value
        }),
        headers: {
          "Content-type": "application/json"
        }
      }
      const response = await fetch('https://dalle-clone-bjvz.onrender.com/images', options);
      console.log(response.status);
      if (response.status === 400) {
        setError("Unable To Generate Images From Description!");
        setLoading(false);
        return;
      } else if (response.status === 429) {
        setError("Too Many Requests! Try Later!");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setImages(data.data);
    } catch (error) {
      
    }
  }

  const surpriseMe = () => {
    setImages(null);
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  }

  useEffect(() => {
    setLoading(false);
  }, [images])

  return (
    <div className="app">

      <section className="search-section">
        <p className="search-info">Start With A Detailed Description
          <motion.span style={{ display: "inline-block" }} whileHover={{ scale: 0.95 }} className="surprise" onClick={surpriseMe}>Surprise Me!</motion.span>
        </p>

        <div className="input-container">
          <input
            placeholder="An impressionist oil painting of a sunflower in a purple vase..."
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleEnter}
          />
          <button onClick={getImages}>Generate</button>
        </div>

        {error &&
          <p className="error-message">{error}</p>
        }

      </section>

      <section className="images-section">
        {images?.map((image, _index) => (
          <img key={_index} src={image.url} alt={`Generated ${value}`} />
        ))}
        {loading === true ? (
          <RotateLoader
            className="loader"
            color={'#4FACF7'}
            loading={loading}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          null
        )}
      </section>

    </div>
  );
}

export default App;
