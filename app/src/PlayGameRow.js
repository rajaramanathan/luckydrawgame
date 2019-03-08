import React from 'react';


export const PlayGameRow = ({ game, playGame }) => <tr>
  <td>{game.id}</td>
  <td>{game.endTime.toString()}</td>
  <td>{game.maxBounty}</td>
  <td><button type="button" onClick={() => playGame(game.id)}>Play</button></td>
</tr>;

