import NavBarOrganism from "../../organisms/CommonOrganisms/NavBarOrganism"
import LoginOrganism from "../../organisms/CommonOrganisms/LoginOrganism"
import FooterMolecule from "../../molecules/CommonMolecules/FooterMolecule"
const LoginPage = () => {
    return (
        <div>
            <NavBarOrganism />
            <LoginOrganism />
            <FooterMolecule/>
        </div>
    )
}

export default LoginPage