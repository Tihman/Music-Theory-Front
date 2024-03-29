import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { fetchPosts, fetchTags } from '../redux/slices/posts';


export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  },[]);
  return (
    <>
      <Grid container spacing={2}>
        <Grid container 
              alignItems="center"
              justifyContent="center">
          <h1>Статьи на тему звуковой информации</h1>
        </Grid>  
        <Grid xs={12} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => isPostsLoading ? (
            <Post key={index} isLoading={true} />
            ) : (
            <Post
              _id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              tags={obj.tags}
              viewsCount={obj.viewsCount}
              isEditable={userData?._id === obj.user._id}
            />
          ))}
        </Grid>
      </Grid>
    </>
  );
};
