import SignUpOrganism from "../../organisms/CommonOrganisms/SignUpOrganism"
import NavBarOrganism from "../../organisms/CommonOrganisms/NavBarOrganism"
import FooterMolecule from "../../molecules/CommonMolecules/FooterMolecule"

const SignUpPage = () => {
    return (
        <div>
            <NavBarOrganism />
            <SignUpOrganism />
            <FooterMolecule/>
        </div>
    )
}

export default SignUpPage