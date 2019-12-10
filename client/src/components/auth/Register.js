import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const Register = props => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;

  const { register, error, clearErrors, isAuthenticated } = authContext;

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/');
    }
    if (error === 'El correo ingresado se encuentra en uso') {
      setAlert(error, 'danger');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const { name, email, password, password2 } = user;

  const onChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();

    if (name === '' || email === '') {
      setAlert('Por favor, complete todos los campos', 'danger');
    } else if (password.length < 6) {
      setAlert('Contraseña debe contener 6 carácteres como mínimo', 'danger');
    } else if (password !== password2) {
      setAlert('Las contraseñas no coinciden', 'danger');
    } else {
      register({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        password
      });
    }
  };

  return (
    <div className='container-auth bg-order-secondary'>
      <h1 className='text-center text-primary'>Registro de Usuario</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Nombre y Apellido:</label>
          <input type='text' name='name' value={name} onChange={onChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Correo electrónico:</label>
          <input type='email' name='email' value={email} onChange={onChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Contraseña:</label>
          <input type='password' name='password' value={password} onChange={onChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='password2'>Confirme contraseña:</label>
          <input type='password' name='password2' value={password2} onChange={onChange} />
        </div>
        <div className='container-auth bg-light'>
          <h4 className=''>¿Preocupado por su seguridad?</h4>
          <p className='text-gray my-1'>
            No se preocupe, para su tranquilidad, su contraseña será exitosamente cifrada con la librería <span className="text-primary">"bcrypt"</span>.
          </p>
        </div>
        <div className="mt-3">
          <input
            type='submit'
            value='Crear usuario'
            className='btn btn-success btn-block btn-form'
          />
        </div>
      </form>
    </div>
  );
};

export default Register;
