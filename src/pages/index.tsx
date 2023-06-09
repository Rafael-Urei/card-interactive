import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useState } from 'react';
import Image from 'next/image';

type Form = {
  name: string,
  number: string,
  month: string,
  year: string,
  cvc: string
}

const inter = Inter({ subsets: ['latin'] })

const schema = yup.object({
  name: yup
  .string()
  .required('This field cannot be blank!')
  .transform((name) => {
    return name
        .toLowerCase()
        .trim()
        .split(' ')
        .map((word: string) => {
            return word[0]?.toLocaleUpperCase().concat(word.substring(1))
        }).join(' ');
  }),
  number: yup
  .string()
  .matches(/^\d+$/, 'Wrong type!')
  .required('This field cannot be blank!')
  .min(16, 'Numbers missing!'),
  month: yup
  .string()
  .matches(/^\d+$/, 'Wrong type!')
  .required('Can\'t  be blank!'),
  year: yup
  .string()
  .matches(/^\d+$/, 'Wrong type!')
  .required('Can\'t be blank!'),
  cvc: yup
  .string()
  .matches(/^\d+$/, 'Wrong type!')
  .required('Can\'t be blank!')
})

export default function Home() {

  const { register, formState: { errors }, handleSubmit } = useForm<Form>({resolver: yupResolver(schema)});
  
  const [completed, setCompleted] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Janne Aplessed',
    number: '0000 0000 0000 0000',
    month: 'MM',
    year: 'YY',
    cvc: '000'
  });

  const onSubmit = (data: Form) => {
    setUserData(data);
    setCompleted(true);
    console.log(userData)
  };

  return (
    <>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.container}>

          <section className={styles.cards_container}>
            <div className={styles.cards}>
              <div className={styles.frontcard_container}>
                <div className={styles.frontcard}>
                  <input className={styles.cd1} type="text" value={userData.number} disabled autoComplete='off' />
                  <input className={styles.cd2} type="text" value={userData.name} disabled autoComplete='off' />
                  <input className={styles.cd3} type="text" value={`${userData.month}/${userData.year}`} disabled autoComplete='off' />
                </div>
                <Image
                  className={styles.froncard_img}
                  src='/bg-card-front.png'
                  alt='frontcard'
                  width={447}
                  height={245}/>
              </div>
              <div className={styles.backcard_container}>
                <div className={styles.backcard}>
                  <input type="text" value={userData.cvc} />
                </div>
                <Image
                  src='/bg-card-back.png'
                  alt='backcard'
                  width={447}
                  height={245}/>
              </div>
            </div>
          </section>

          { !completed
            ?
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.form_first_div}>
                <label htmlFor="">CARDHOLDER NAME</label>
                <input type="text" {...register('name')} placeholder='e.g. Jane Appleseed' autoComplete='off' className={errors.name?.message ? styles.input_error : styles.input} />
                { errors.name ? <p className={styles.error}>{errors.name.message}</p> : null }
                <label htmlFor="">CARD NUMBER:</label>
                <input type="text" {...register('number')} maxLength={16} placeholder='e.g. 1234 5678 9123 0000' autoComplete='off' className={errors.number ? styles.input_error : styles.input} />
                { errors.number ? <p className={styles.error}>{errors.number.message}</p> : null }
              </div>
              <div className={styles.form_second_div}>
                <div className={styles.my_container}>
                  <label htmlFor="">EXP.DATE(MM/YY)</label>
                  <div className={styles.my_input_div}>
                    <input type="text" {...register('month')} maxLength={2} placeholder='MM' autoComplete='off' className={errors.month ? styles.input_error : styles.input} />
                    <input type="text" {...register('year')} maxLength={2} placeholder='YY' autoComplete='off' className={errors.year ? styles.input_error : styles.input} />
                  </div>
                  { errors.month || errors.year ? <p className={styles.error}>{errors.month?.message || errors.year?.message}</p> : null }
                </div>
                <div className={styles.cvc_container}>
                  <label htmlFor="">CVC</label>
                  <input type="text" {...register('cvc')} maxLength={3} placeholder='e.g. 123' autoComplete='off' className={errors.cvc ? styles.input_error : styles.input} />
                  { errors.cvc ? <p className={styles.error}>{errors.cvc.message}</p> : null }
                </div>
              </div>
              <button type='submit' className={styles.button}>Confirm</button>
            </form>
            :
            <div className={styles.greetings}>
              <Image
                src='/icon-complete.svg'
                alt='completed'
                width={50}
                height={50}
              />
              <h1>THANK YOU!</h1>
              <p>We have added your card details</p>
              <button type='submit' className={styles.button} onClick={() => setCompleted(false)}>Continue</button>
            </div>
            
          }
          
        </div>
      </main>
    </>
  )
}
