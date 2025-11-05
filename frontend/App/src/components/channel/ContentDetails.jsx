import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Toast } from '../toast/Toast';
import { ChannelSubscriptionUI } from './ChannelSubscriptionUI';
import { IncrementViews } from '../../services/ViewsService';
import { FetchContentDetails } from '../../services/ContentService';
import { ToogleFollowChannel } from '../../services/FollowSevice';

export const GetContentDetails = (id) => {
  const navigate = useNavigate();
  // const location = useLocation();

  const [video, setVideo] = useState(null);
  const [contentItem, setContentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [creatorData, setCreatorData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const contentType = location.pathname.substring(1);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    if (!id) {
      setError("CONTENT ID IS MISSING FROM THE URL");
      setIsLoading(false);
      return;
    };

    const fetchContentDetails = async () => {
      setIsLoading(true);

      //-----GET CURRENTJ USER ID-----//
      const currentUserId = localStorage.getItem('userId');

      try {
        const result = await FetchContentDetails(id); //-----video object data-----//
        if (result) {
          setVideo(result);
          setContentItem(result);

          if (result.creator) {
            setCreatorData(result.creator);
            setFollowerCount(result.creator.followers.length);

            if (currentUserId && result.creator.followers.includes(currentUserId)) {
              setIsFollowing(true);
            }

            else {
              setIsFollowing(false);
            };
          };


          await IncrementViews(id) //-----Increment views-----//
        }
        else {
          setError("Failed to load content details.");
        }
      }

      catch (error) {
        console.error("Failed to fetch data", error.message);
        Toast.error(error.message);
      }

      finally {
        setIsLoading(false);
      };
    };


    fetchContentDetails();
  }, [location.search]);

  //-----Function TO INCREMENT VIEWS----------//
  const IncrementContentViews = async (contentIdToIncrement) => {
    try {
      const viewResponse = await IncrementViews(contentIdToIncrement);
      if (viewResponse && viewResponse.data && typeof viewResponse.data.views !== 'undefined') {
        setVideo(prev => prev ? { ...prev, views: viewResponse.data.views } : null);
        setContentItem(prev => prev ? { ...prev, views: viewResponse.data.views } : null);
      }
    }

    catch (error) {
      console.log("Filed to increment views", error.message);
      Toast.error("failed to increment views");
    }
  }


  //-----Function FOR FOLLOW FEATURE----------//
  const HandleToogleFollow = async () => {
    const token = localStorage.getItem('token'); //-----TODO: MAKE AUTH-CONTEXT-----//
    if (!creatorData || !creatorData._id || !token) {
      Toast.error("Cannot follow, Missing channel ID or authentication token");
      return;
    }

    try {
      const response = await ToogleFollowChannel(creatorData._id, token)
      setIsFollowing(response.data.isFollowing);
      setFollowerCount(response.data.followerCount);
      Toast.success(response.data.message);
    }

    catch (error) {
      Toast.error(error.message || "Failed to toogle follow status");
    }

  };
  if (isLoading) {
    return (
      <div className='bg-black text-white min-h-screen flex items-center justify-center'>
        <p>Loading video.....</p>
      </div>
    )
  };

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 text-lg mb-4">Error: {error}</p>
        <button onClick={() => navigate('/content')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Back to Content
        </button>
      </div>
    );
  };

  if (!contentItem) return null;

  if (!video) return null;

  return (
    <>

      {contentType === 'watch' && video && (
        <div>
          <ChannelSubscriptionUI
            videoUrl={video.url}
            videoTitle={video.title}
            views={video.views}
            creatorId={creatorData ? creatorData._id : ""}
            creatorUsername={creatorData ? creatorData.username : ""}
            followerCount={followerCount}
            isFollowing={isFollowing}
            onToogleFollow={HandleToogleFollow}
          />
        </div>
      )}

      {contentType === 'image' && contentItem && (
        <img src={contentItem.url} alt={contentItem.title} className="max-w-4xl w-full h-auto rounded-lg shadow-lg" />
      )}

      {contentType === 'file' && contentItem && (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400 text-sm mb-4">📄 File: {contentItem.title}</p>
          <a
            href={contentItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center"
          >
            Download File
          </a>
        </div>
      )}

    </>
  )
}
