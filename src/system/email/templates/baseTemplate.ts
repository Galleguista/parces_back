export const baseTemplate = `
<div style="font-family: Arial, sans-serif, EmojiFont;">
<div style="margin:auto; max-width:600px; padding:15px 0">
  <div style="background-color:#003333; padding:15px 0">
    <div style="color:#FFFFFF; font-size:14px; text-align:center">
      <img src="https://cdn.umanizales.edu.co/images/7ee982d9-b2d6-467c-9487-37f9f7e8afcf.png" alt="Universidad de Manizales" height="75">
    </div>
  </div>
  <div style="background-color:#F2F2F2">
    <img src="https://cdn.umanizales.edu.co/images/d95fd18d-54b3-431c-9e1e-752f0324cca3.jpg" alt="A3GIS" style="width:100%">
  </div>
  <div style="background-color:#F2F2F2; padding:30px 60px 60px">
    <div style="color:#333333; font-size:16px">
        {{{content}}}
      <div style="font-size:14px; font-weight:600; margin-top:60px">
        <p>No respondas este mensaje, ha sido enviado automáticamente. Si deseas ponerte en contacto con nosotros para comentarnos alguna incidencia o mejora del servicio, escríbenos a <a href="mailto:mesadeayuda@umanizales.edu.co">mesadeayuda@umanizales.edu.co</a>.</p>
      </div>
    </div>
  </div>
  <div style="background-color:#003333; padding:30px">
    <div style="color:#FFFFFF; font-size:12px; text-align:center">
    <div style="color:#DCA005; font-size:14px">© ${new Date().getFullYear()} - Universidad de Manizales</div>
      <div>Todos los derechos reservados</div>
    </div>
  </div>
</div>
</div>
`;