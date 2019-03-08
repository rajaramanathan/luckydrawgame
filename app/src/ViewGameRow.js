import React from 'react';

export const ViewGameRow = ({ game }) => <tr>
  <td>{game.id}</td>
  <td>{game.endTime.toString()}</td>
  <td>{game.maxBounty}</td>
  <td>{game.win}</td>
</tr>;

