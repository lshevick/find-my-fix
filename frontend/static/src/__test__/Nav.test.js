import {render, screen} from '@testing-library/react'
import Nav from '../components/Nav'
import { BrowserRouter } from 'react-router-dom'
import * as rrd from 'react-router-dom'

describe("<Nav/>", () => {
    it('renders nav correctly', () => {
        render(
        <BrowserRouter>
        <Nav/>
        </BrowserRouter>
        );
        expect(screen.getByText(/Find/i)).toBeInTheDocument();
    })


})