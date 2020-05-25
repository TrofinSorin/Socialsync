import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScrollReverse from 'react-infinite-scroll-reverse';
import Loader from '@shared/Loader/Loader';

const InfiniteScrollContainer = props => {
  console.log('props:', props);

  return (
    <InfiniteScrollReverse hasMore={props.hasMore} isLoading={props.loading} loadMore={props.setPage} loadArea={20}>
      {props.children}
    </InfiniteScrollReverse>
  );
};

InfiniteScrollContainer.propTypes = {
  data: PropTypes.array, // optional data if no restaurants prop are sent
  items: PropTypes.array,
  loading: PropTypes.bool,
  hasMore: PropTypes.bool,
  onLoadMore: PropTypes.func
};

export default InfiniteScrollContainer;
