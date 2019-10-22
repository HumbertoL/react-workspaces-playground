import React from 'react';

import {
  MenuItem,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';


const SkeletonRow = () => (
  <MenuItem>
    <Skeleton width="90%" height="16px" />
  </MenuItem>
);

export default SkeletonRow;
