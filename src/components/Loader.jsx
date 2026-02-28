import './Loader.css';

export default function Loader({ size = 'md', fullPage = false }) {
    const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';

    return (
        <div className={`loader-container ${fullPage ? 'loader-fullpage' : ''}`}>
            <div className={`spinner ${sizeClass}`}></div>
        </div>
    );
}
