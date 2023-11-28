import { Link } from 'react-router-dom'

type BoxProps = {
    className?: string;
};

const LogoNavMolecule = ({ className }: BoxProps) => {
    return (
        <div>
            <div className='flex items-center text-3xl font-semibold font-mono'>
                <Link className='link' to="/"><img className='h-14 w-14' src='/programming.png'></img></Link>
                Renaissance
            </div>
        </div>
    )
}

export default LogoNavMolecule