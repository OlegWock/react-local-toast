import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { LocalToastProvider, LocalToastTarget, useLocalToast } from '../../../dist/react-local-toast.esm';

const App = () => {
    const createUpdateToast = () => {
        if (id === null) {
            setId(showToast('btn5', 'Loading...', {type: 'info', duration: 0}));
        } else {
            const toastId = id;
            updateToast(toastId, {
                type: 'success',
                text: 'Successfully downloaded!'
            });
            setTimeout(() => {
                removeToast(toastId);
            }, 2000);
            setId(null);
        }
    }

    const {showToast, updateToast, removeToast} = useLocalToast();
    const [id, setId] = useState(null);

    return (<div>
        Hello! 
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat debitis quam odit sequi alias rem fugit sit explicabo, quisquam consectetur at aliquid exercitationem maiores aspernatur voluptatem! Accusantium ab vel eveniet.</p>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat debitis quam odit sequi alias rem fugit sit explicabo, quisquam consectetur at aliquid exercitationem maiores aspernatur voluptatem! Accusantium ab vel eveniet.</p>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat debitis quam odit sequi alias rem fugit sit explicabo, quisquam consectetur at aliquid exercitationem maiores aspernatur voluptatem! Accusantium ab vel eveniet.</p>

        <div style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
            <LocalToastTarget name='btn1'><button onClick={() => showToast('btn1', 'Hello!', {type: 'success', duration: 2500, placement: 'top'})}>Top</button></LocalToastTarget>
            <LocalToastTarget name='btn3'><button onClick={() => showToast('btn3', 'Hello!', {type: 'info', duration: 2500, placement: 'left'})}>Left</button></LocalToastTarget>
            <LocalToastTarget name='btn4'><button onClick={() => showToast('btn4', 'Hello!', {type: 'warning', duration: 2500, placement: 'right'})}>Right</button></LocalToastTarget>
            <LocalToastTarget name='btn2'><button onClick={() => showToast('btn2', 'Hello!', {type: 'error', duration: 2500, placement: 'bottom'})}>Bottom</button></LocalToastTarget>
        </div>

        <div style={{width: '100%', marginTop: 48, display: 'flex', justifyContent: 'space-around'}}>
            <LocalToastTarget name='btn5'><button onClick={createUpdateToast}>Click to create, click again to update</button></LocalToastTarget>
        </div>
    </div>)
}

ReactDOM.render(<LocalToastProvider animationDuration={80}><App /></LocalToastProvider>, document.getElementById('root'));
