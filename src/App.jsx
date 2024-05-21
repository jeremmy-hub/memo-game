/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { v4 as uuid } from 'uuid';
const url = 'https://api.giphy.com/v1/stickers/random?api_key=FFEChJmynaVGREDvL6ZFV3S8M16JPcO9&tag=&rating=g';

async function get_NewImageObject(API, database, max_tries = 0) {
    // This function extracts a unique image object not present in the reference database argument
    if (max_tries > 10) { throw new Error(`Unable to find a unique image after ${max_tries} tries...`) }
    try {
        const response = await fetch(API);
        if (!response.ok) { throw new Error(`Exited with status code ${response.status}`) }
        const data = await response.json();
        if (data.data.images.original.url && !database.current.includes(data.data.images.original.url)) {
            // If a unique image is found, it is assigned a unique id and returned
            database.current.push(data.data.images.original.url); // Update ref instead of state
            return { ...data.data.images.original, id: uuid() };
        }
    }
    catch (error) {
        console.log(`Error: ${error.message}`);
    }

    return get_NewImageObject(API, database, max_tries + 1);
}

export default function Main() {
    const [IMAGES, set_IMAGES] = useState([]);
    const IMAGES_URLS = useRef([]); // Use ref to track image URLs without causing re-renders
    const [LEVEL, set_LEVEL] = useState('easy');
    const [SCORES, set_SCORE] = useState(0);
    const [BEST_SCORES, set_BEST_SCORE] = useState(0);
    const [CLICKED, set_CLICKED] = useState([]);

    function increment_score() {
        set_SCORE((previous_score) => previous_score + 1);
        if (SCORES >= BEST_SCORES) {
            set_BEST_SCORE(SCORES + 1);
        }
    }

    function reset_score() { set_SCORE(0) }

    useEffect(() => {
        async function fetchData() {
            const images = [];
            const numImages = {
                easy: 4,
                medium: 8,
                hard: 12,
                amateur: 16,
            }[LEVEL] || 4;

            for (let i = 0; i < numImages; i++) {
                const newImage = await get_NewImageObject(url, IMAGES_URLS);
                images.push(newImage);
            }
            set_IMAGES(images);
        }
        fetchData();
    }, [LEVEL]);

    function handleClick(referrence) {
        if (!CLICKED.includes(referrence)) {
            set_CLICKED([...CLICKED, referrence]);
            increment_score();
        } else {
            reset_score();
        }
    }

    const ScoreBoard = ({ className }) => {
        return (
            <div className={`container-fluid-md score-board ${className}`}>
                <div className={`row bg-secondary navigation-panel p-1`}>
                    <div role='navigation' className="col-6 d-flex flex-row flex-wrap justify-content-center align-content-center"> 
                    <span className="h2 logo">memory-joker</span>
                    </div>

                    <div className="col-6 d-flex flex-column scores">
                        <div role='navigation' className="p-2 d-flex flex-row flex-wrap justify-content-around">
                            <form action="/" method="post" className="flex-fill d-flex flex-row flex-wrap justify-content-evenly level-setter bg-success m-1 p-2">
                                <label htmlFor="game-level" className="text-center">LEVEL : </label>
                                <select value={LEVEL} name="level" id="game-level" onChange={(event) => { set_LEVEL(event.target.value); }} className="text-center level-selector">
                                    <option value="easy">easy</option>
                                    <option value="medium">medium</option> 
                                    <option value="hard">hard</option>
                                    <option value="amateur">amateur</option>
                                </select>
                            </form>
                        </div>

                        <div className="scores-display d-flex flex-wrap align-items-center justify-content-center p-2">
                            <div role='navigation' className="text-center flex-fill m-1">
                                <span className="m-1 p-1 level-selector">Current Score:</span>
                                <br />{SCORES}
                            </div>

                            <div role='navigation' className="text-center flex-fill m-1">
                                <span className="m-1 p-1 level-selector">High Score:</span>
                                <br />{BEST_SCORES}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    const Display = ({ className }) => {
        return (
            <div className={`${className}`}>
                {IMAGES.map((image) => {
                    return (
                        <div className="card m-1 p-2 image-item"
                            style={{ width: "clamp(100px, 20vw, 200px)", height: 'clamp(100px, 20vw, 200px)', marginInline: '10px', position: 'relative' }}
                            key={image.id}
                            onClick={() => { handleClick(image.id) }}
                            onTouchCancel={() => { handleClick(image.id) }}>

                            <img src={image.url}
                                className="card-img-top"
                                alt='...'
                                style={{ width: "100%", height: '100%', marginInline: '1vw' }} />

                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="bg-success">
            <ScoreBoard className='score-board' />
            <Display className='display bg-secondary p4 d-flex flex-wrap align-content-center justify-content-center' />
        </div>
    );
}
