import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom/extend-expect'


const server = setupServer(
  rest.get('/testGoogleImageApi', (req, res, ctx) => {})
)

test('displays images', () => {

})