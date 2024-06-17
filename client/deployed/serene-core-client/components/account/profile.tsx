import { signIn, signOut } from 'next-auth/react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import ActionNotification from '../notifications/action'
import { RestApiService } from '../../services/rest-api/service'
import Select from '@mui/material/Select'
import { FormControl, InputLabel, Typography } from '@mui/material'
import { countries } from '../../services/locale/countries'
import { useRecoilValue } from 'recoil'
import { userProfileAtom } from '../../atoms/user'
import { getUserPreferencesQuery } from '../../apollo/user-preferences'
import { UserPreferencesService } from '../../services/users/user-preferences-service'
import { ProfileService } from '../../services/users/profile-service'
import { useLazyQuery } from '@apollo/client'

export default function Profile({
                          clientUrl,
                          serverUrl,
                          session
                        }) {

  // Consts
  const personalDetails = 'personal details'

  // State
  const [fullName, setFullName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [country, setCountry] = useState('United States')
  /* const [billingNameAsMyName, setBillingNameAsMyName] = useState(true)
  const [billingCountryAsMyCountry, setBillingCountryAsMyCountry] = useState(true)
  const [billingFirstName, setBillingFirstName] = useState('')
  const [billingLastName, setBillingLastName] = useState('')
  const [billingCountry, setBillingCountry] = useState('United States')
  const [billingAddressLine1, setBillingAddressLine1] = useState('')
  const [billingAddressLine2, setBillingAddressLine2] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingState, setBillingState] = useState('')
  const [billingZip, setBillingZip] = useState('') */

  const [zipLabel, setZipLabel] = useState('Zip')

  const [notificationSuccessText, setNotificationSuccessText] = useState('')
  const [notificationSuccessOpened, setNotificationSuccessOpened] = useState(false)
  const [notificationErrorText, setNotificationErrorText] = useState('')
  const [notificationErrorOpened, setNotificationErrorOpened] = useState(false)

  // Recoil
  const userProfile = useRecoilValue(userProfileAtom)

  // Services
  const profileService = new ProfileService()

  // GraphQL
  const [fetchGetUserPreferencesQuery] =
    useLazyQuery(getUserPreferencesQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('attributeTypeName: ' + attributeTypeName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  function guessFirstNameFromFullName() {

    // Get first instance of a space
    let firstSpace = fullName.indexOf(' ')

    // The space can't be either not found or the first char, return if so.
    if (firstSpace <= 0) {
      return
    }

    setFirstName(fullName.substring(0, firstSpace))
  }

  const handleSignin = (e) => {
    e.preventDefault()
    signIn()
  }

  const handleSignout = (e) => {
    e.preventDefault()
    signOut()
  }

  async function setProfile() {

    const restApiService: RestApiService =
            new RestApiService(clientUrl,
                               serverUrl)

    restApiService.submit({
      relativeUrl: '/api/account/profile/update',
      values: {
        // token: token,
        userProfileId: userProfile.id,
        fullName: fullName,
        firstName: firstName,
        country: country,
        /* billingNameAsMyName: billingNameAsMyName.toString(),
        billingCountryAsMyCountry: billingCountryAsMyCountry.toString(),
        billingFirstName: billingFirstName,
        billingLastName: billingLastName,
        billingCountry: billingCountry,
        billingAddressLine1: billingAddressLine1,
        billingAddressLine2: billingAddressLine2,
        billingCity: billingCity,
        billingState: billingState,
        billingZip: billingZip */
      },
      setNotificationSuccessText: setNotificationSuccessText,
      setNotificationSuccessOpened: setNotificationSuccessOpened,
      setNotificationErrorText: setNotificationErrorText,
      setNotificationErrorOpened: setNotificationErrorOpened })
  }

  // Events

  // Get profile data on load
  useEffect(() => {

    const fetchData = async () => {

      // Get profile data
      // console.log(`fetching getUserPreferencesQuery for userProfileId: ${user.id}`)

      const results =
        await fetchGetUserPreferencesQuery(
          {
            variables: {
              userProfileId: userProfile.id,
              category: personalDetails,
              keys: [ profileService.fullName,
                      profileService.firstName,
                      profileService.countryCode,
                      /* profileService.billingNameAsMyName,
                      profileService.billingCountryAsMyCountry,
                      profileService.billingFirstName,
                      profileService.billingLastName,
                      profileService.billingCountryCode,
                      profileService.billingAddressLine1,
                      profileService.billingAddressLine2,
                      profileService.billingCity,
                      profileService.billingState,
                      profileService.billingZip */ ]
            }
          })

      // Set profile data
      const keyValues = results.data['getUserPreferences']

      for (const keyValue of keyValues) {
        switch (keyValue.key) {

          case profileService.fullName: {
            setFullName(keyValue.value)
            break
          }

          case profileService.firstName: {
            setFirstName(keyValue.value)
            break
          }

          case profileService.countryCode: {
            setCountry(profileService.getCountryByCode(keyValue.value))
            break
          }

          /* case profileService.billingNameAsMyName: {
            setBillingNameAsMyName(JSON.parse(keyValue.value))
            break
          }

          case profileService.billingCountryAsMyCountry: {
            setBillingCountryAsMyCountry(JSON.parse(keyValue.value))
            break
          }

          case profileService.billingFirstName: {
            setBillingFirstName(keyValue.value)
            break
          }

          case profileService.billingLastName: {
            setBillingLastName(keyValue.value)
            break
          }

          case profileService.billingCountryCode: {
            setBillingCountry(profileService.getCountryByCode(keyValue.value))
            break
          }

          case profileService.billingAddressLine1: {
            setBillingAddressLine1(keyValue.value)
            break
          }

          case profileService.billingAddressLine2: {
            setBillingAddressLine2(keyValue.value)
            break
          }

          case profileService.billingCity: {
            setBillingCity(keyValue.value)
            break
          }

          case profileService.billingState: {
            setBillingState(keyValue.value)
            break
          }

          case profileService.billingZip: {
            setBillingZip(keyValue.value)
            break
          } */
        }
      }
    }

    if (userProfile.id !== null) {
      const result = fetchData()
        .catch(console.error)
    }

  }, [userProfile.id])

  /* Zip/postal code label
  useEffect(() => {

    setZipLabel(
      userPreferencesService.getZipOrPostalCodeLabel(
        country,
        billingCountryAsMyCountry,
        billingCountry))

  }, [country, billingCountryAsMyCountry, billingCountry]) */

  // Render
  return (
    <>
      {session ?
       <>
         <p>You're signed in: &nbsp;
          <span style={{ color: 'gray', fontWeight: '600' }}>{session.user.email}</span>
          <span style={{ marginLeft: '1em' }}>
            (<a
              href='#'
              onClick={handleSignout}
              className='btn-signin'>Sign out</a>)
          </span>
         </p>

          {/* <p>userProfile: {JSON.stringify(userProfile)}</p> */}

          <form
            onSubmit={(e) => { setProfile(); e.preventDefault(); }}
            style={{ marginTop: '2em' }} >

            <Typography
              style={{ marginBottom: '1em' }}
              variant='h6'>
              Personal details
            </Typography>

            <Typography
              style={{ marginBottom: '1em' }}
              variant='body1'>
              These fields are required and are used to personalize your
              experience.
            </Typography>

            <TextField
              autoFocus
              fullWidth
              variant='standard'
              label='Full name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={(e) => {
                if (fullName == null) {
                  return
                } else if (fullName.trim() === '') {
                  return
                }

                if (firstName == null) {
                  guessFirstNameFromFullName()
                } else if (firstName.trim() === '') {
                  guessFirstNameFromFullName()
                }
              }}
              required />
            <br/><br/>
            <TextField
              fullWidth
              variant='standard'
              label='First name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required />
            <br/><br/>
            <FormControl fullWidth>
              <InputLabel
                htmlFor='select-country'
                required
                shrink>
                Country
              </InputLabel>
              <Select
                inputProps={{
                  id: 'select-country',
                }}
                label='Country'
                native
                onChange={(e) => setCountry(e.target.value)}
                variant='standard'
                value={country}>
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <br/><br/>
            {/* <p><b>Billing address</b></p>
            <Checkbox
              checked={billingNameAsMyName}
              onChange={(e) => { setBillingNameAsMyName(e.target.checked) }} />
              Billing name is the same as in personal details
            <br/>
            <Checkbox
              checked={billingCountryAsMyCountry}
              onChange={(e) => { setBillingCountryAsMyCountry(e.target.checked) }} />
              Billing country is the same as in personal details
            {billingNameAsMyName === false ?
              <>
                <TextField
                  autoFocus
                  fullWidth
                  variant='standard'
                  label='First name'
                  value={billingFirstName}
                  onChange={(e) => setBillingFirstName(e.target.value)}
                  required />
                <br/><br/>
                <TextField
                  fullWidth
                  variant='standard'
                  label='Last name'
                  value={billingLastName}
                  onChange={(e) => setBillingLastName(e.target.value)}
                  required />
                <br/><br/>
              </>
              :
              <></>
            }
            {billingCountryAsMyCountry === false ?
              <>
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor='select-country'
                    required
                    shrink>
                    Country
                  </InputLabel>
                  <Select
                    inputProps={{
                      id: 'select-country',
                    }}
                    label='Country'
                    native
                    onChange={(e) => setBillingCountry(e.target.value)}
                    variant='standard'
                    value={billingCountry}>
                    <option key='blankBillingCountry' value=''></option>
                    {countries.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <br/><br/>
              </>
              :
              <></>
            }
            <TextField
              fullWidth
              variant='standard'
              label='Line 1'
              value={billingAddressLine1}
              onChange={(e) => setBillingAddressLine1(e.target.value)}
              required />
            <br/><br/>
            <TextField
              fullWidth
              variant='standard'
              label='Line 2'
              value={billingAddressLine2}
              onChange={(e) => setBillingAddressLine2(e.target.value)} />
            <br/><br/>
            <TextField
              fullWidth
              variant='standard'
              label='City'
              value={billingCity}
              onChange={(e) => setBillingCity(e.target.value)}
              required />
            <br/><br/>
            <TextField
              fullWidth
              variant='standard'
              label='State'
              value={billingState}
              onChange={(e) => setBillingState(e.target.value)} />
            <br/><br/>
            <TextField
              fullWidth
              variant='standard'
              label={zipLabel}
              value={billingZip}
              onChange={(e) => setBillingZip(e.target.value)}
              required />
            <br/><br/> */}

            <Button
              type='submit'
              variant='contained'
              style={{ marginTop: '2em' }}>
              Update
            </Button>
          </form>
          <ActionNotification
              message='Updated.'
              autoHideDuration={5000}
              notificationOpened={notificationSuccessOpened}
              setNotificationOpened={setNotificationSuccessOpened} />
          <ActionNotification
              message={notificationErrorText}
              autoHideDuration={5000}
              notificationOpened={notificationErrorOpened}
              setNotificationOpened={setNotificationErrorOpened} />
       </>
       :
       <>
         <p>You aren't signed in. All canvases you create will be temporary.</p>
         <a href='#' onClick={handleSignin} className='btn-signin'>Sign in</a>
       </>
      }
     </>
  )
}
