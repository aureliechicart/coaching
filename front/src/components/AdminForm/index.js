import React, {useState} from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';

  const FormAdmin = ({base_url}) => {
    const [email, setEmailAdmin] = useState('');
    const [hidden, setHidden] = useState(true);
    const [visible, setVisible] = useState(false);
    const [positive, setPositive] = useState(false);
    const [negative, setNegative] = useState(false);
    const [result, setResult] = useState('');
    const postUrl = `${base_url}/v1/api/admin/add`;

        const showMessage = (status) => {
          if(status == 200){
            setHidden(false);
            setVisible(true);
            setResult("Vous avez ajouté un nouvel administrateur ! Bienvenue à lui!");
          }else if(status == 401) {
            setHidden(false);
            setVisible(true);
            setResult("Un étudiant admin ?! Mais vous êtes fous ??? Oh OUI ! ");
          }else if(status == 404) {
            setHidden(false);
            setVisible(true);
            setResult("Mais t'es où, pas là ! Mais t'es pas là, mais t'es... Bref, tu connais la chanson, essaie de verifier l'orthographe du mail peut-être on ne sait jamais !");
          }
        }


        const handleSubmitEmail = () => {

          const data = {
            email: email
          }
          const headers = {
            'Content-Type': 'application/json'
          };
            axios.post(postUrl, data, {headers}).then(res => {
              
              setPositive(true);
              showMessage(res.status);
              setEmailAdmin('');
            }).catch(err => {
              setPositive(false);
              setNegative(true);
              // setResult(err.response.data)
              console.log(err.response.status);
              showMessage(err.response.status);
            }).finally(
              console.log("post url", postUrl),
              console.log("je suis dans le finally"),
            )
        }

      return(
        <Form success className="addadminform">
          <Message
            className="messageaddadmin"
            hidden={hidden}
            visible={visible}
            success={positive}
            negative={negative}
            compact
            content={result}
          />
          <Form.Input
            label='Email'
            type="text"
            placeholder='mail du nouvel admin'
            value={email}
            onChange={e => setEmailAdmin(e.target.value)}
          />
          <Button className='bouton-addadmin'
            onClick={handleSubmitEmail}
          >Adouber un Coach</Button>
        </Form>

      )
    }

export default FormAdmin
