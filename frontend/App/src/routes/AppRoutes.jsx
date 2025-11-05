import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { Home } from '../components/Home'
import { Register } from '../pages/authentication/Register';
import { Login } from '../pages/authentication/Login'
import { Content } from '../pages/Content'

import { GetContentDetails as ContentDetailPage } from '../components/channel/ContentDetails'
import { AccountProfile as EditProfilePage } from '../pages/accountpage/AccountProfile';

import { Upload } from '../components/upload/Upload'
import { UserMyProfilePage } from '../pages/UserMyProfilePage'
import { DemoMyProfilePage } from '../pages/DemoMyProfilePage';

export const AppRoutes = () => {
  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/content" element={<Content />} />

        <Route path="/watch" element={<ContentDetailPage />} />
        <Route path="/image" element={<ContentDetailPage />} />
        <Route path="/file" element={<ContentDetailPage />} />

        <Route path="/account/profile/edit/:id" element={<  EditProfilePage />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<UserMyProfilePage />} />
        <Route path="/demoprofile" element={<DemoMyProfilePage />} />
      </Routes>
    </BrowserRouter>

  )
}