/**
 * Contact.tsx -  Contact registration.
 */

 import { ChangeEvent, FormEvent, useState } from "react";

 import {
   Form,
   Button,
   Container,
   Card,
   Row,
   Col,
   Image,
 } from "react-bootstrap";
 
 import { IContact } from "./ContactsType";
 import { createContact } from "./ContactsServices";
 import MediaQuery from "react-responsive";
 import { ScreenSize } from "../../helpers/mediaquery";
 import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
 import { imagesPath } from "../../helpers/environment"
 import { useWaitToRedirect } from "../../common/hooks/useWaitToRedirect";
 import "./Contacts.css"
  
 /**
  * Contacts - Process the registration form.
  * 
  *           Functional component
  * 
  * 
  * @returns - JSX element.
  */
 
 const Contacts = () => {
 
   // Type depends on the type of HTML input
   type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
 
   const initialContact = {
     cont_name: "",
     cont_email: "",
     cont_comments: "",
   };
 
   const [contact, setContact] = useState<IContact>(initialContact);
 
   const [waitExit, setWaitExit] = useState(false);
   const timeWait = 6000; //ms
   const redirectPage = "/"; //home
 
   /**
    * handleInputChange
    * 
    *    It captures typing events generated when entering values ​​in the html fields,
    *      and sets the corresponding internal state variable with the value entered in the "input".
    *   This function is associated by placing "onChange = {handleInputChange}" in the "input" of the form.
    *    A correspondence is defined between the names of the inputs in the HTML and the fields of the state variable IContact
    * 
    * @param e - Event information.
    */
 
   const handleInputChange = (e: InputChange) => {
     setContact({ ...contact, [e.target.id]: e.target.value });
   };
 
 /**
  * handleSubmit - Process the information uploaded in the contact form.
  *   
  * @param e - Form event
  */
 
   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
     e.preventDefault();
 
     await toast.promise(createContact(contact), {
       pending: {
         render({ data }) {
           return `In progress.....`;
         },
         className: "custom-toast",
         position: toast.POSITION.TOP_RIGHT,
       },
       success: {
         render({ data }) {
           return `Thank you for contacting us!. We will communicate soon.`;
         },
         className: "custom-toast",
         position: toast.POSITION.TOP_RIGHT,
         autoClose: 4000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         icon: "🟢",
       },
       error: {
         render({ data }) {
           return `We're sorry. An error has occurred. Your request could not be processed.`;
         },
         className: "custom-toast",
         position: toast.POSITION.TOP_RIGHT,
         autoClose: 4000,
         icon: "🔴",
       },
     })
     .then(() => setWaitExit(true))
     .catch(() => setWaitExit(true));
 
   };
 
 
/**
 * showForm - Form. Same format for all device sizes.
 * 
 * @returns - JSX element.
 */

   const showForm = () => {
     return (
      <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="cont_name">
        <Form.Control
          type="text"
          placeholder="Enter your name"
          autoFocus
          value={contact.cont_name}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="cont_email">
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={contact.cont_email}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-5" controlId="cont_comments">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter your comments"
          value={contact.cont_comments}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <div className="contact-div-button  mb-2">
        <Button
          className="contact-button"
          size="lg"
          type="submit"
          >
          Send Message
        </Button>
     </div>
    </Form>      
     )
   }
 
   useWaitToRedirect(redirectPage, timeWait, waitExit);

   return (
     <>
       <MediaQuery
         minWidth={ScreenSize.isMobile}
         maxWidth={ScreenSize.isTablet - 1}
       >
         <Container fluid>
           <Row className="contact-common-styles">
             <Col >
               <Card className="mx-3 mt-2 mb-5">   
                 <Card.Body>
                 {showForm()}
                 </Card.Body>
               </Card>
             </Col>
           </Row>
         </Container>
       </MediaQuery>
 
       <MediaQuery
         minWidth={ScreenSize.isTablet}
         maxWidth={ScreenSize.isDesktop - 1}
       >
         <Container fluid>
           <Row className="contact-common-styles">
             <Col>
               <Image className="contact-image-tb" 
                     src={`${imagesPath()}contact/contact-tb.jpg`} />
               <Card className="mx-auto mt-2 mb-5">
                 <Card.Body>
                 {showForm()}
                 </Card.Body>
               </Card>
             </Col>
           </Row>
         </Container>
       </MediaQuery>
 
       <MediaQuery minWidth={ScreenSize.isDesktop}>
         <Container fluid>
           <Row className="contact-common-styles">
             <Col lg={7} xs={7} md={7}>
               <Card className="ms-3 mt-3">
                 <Card.Body>
                  {showForm()}
                 </Card.Body>
               </Card>
             </Col>
             <Col lg={4} xs={4} md={4}>
               <Image className="contact-image-dk mt-3"
                     src={`${imagesPath()}contact/contact.jpg`} />
             </Col>
           </Row>
         </Container>
       </MediaQuery>
       <ToastContainer />
     </>
   );
 };
 
 export default Contacts;
 