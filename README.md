# CellularAutomataGame

Deployed Application Can be viewed here: www.tirmat.com

Game Help:
- The game objective is to, using the resources of the user, to generate a specific structure of cells on the board. This structure of cells
is only possible by using the sub-rules, which allow you to generate more cells on the board that may be needed to generate that final structure.
Generations can be done by pressing the button on the left, and tiles can be switched either by 0-10 on the keyboard or by clicking on them directly.

A rule can only be matched if every flat edge of the set touches an empty space. 

Algorithm Pseudocode:

### Pattern matching Subroutine -
## Preprocessing: Construct a DFA using the shape dictionary:
		- Q: Each state is how a certain rectangle configuration 
		- Epsilon: (Movement direction, To-State color)
		- qs: Single cell in left corner
		- QAccepting: States that represent the bottom right corner of the board (also if acceptance state, then put in the generating area)
		- Delta - Q x (Movement direction, To-State color) = Q\
	- Disjoint set add 
		- Assume the following struct definition:
			- disjoint_set = 
			{
				bounds: ((x, y), height, width)
				members: [(x,y)]
			}
			- lookup = 
			{
				(x,y) : *disjoint_set that (x,y) is a member of
			}
		- Assume cell A, with coordinates x and y, is added to the board from color o (unfilled)  to color b
			- If all 4 cells in the cardinal direction of A are colored o, then create a new disjoint set of color A
			- Else if at least one of the cells are colored non-o
				- For each cell colored in
					- Lookup the disjoint set D in the lookup table (O(1))
					- Get the bounds for that disjoint set - ((x,y), height, width);
					- Select the disjoint set that has the (x,y) in the most upper-left corner area
						- Update the bounds of that disjoint set using the bounds of the other disjoint sets (including the new point)
						- Push the members to the disjoint set in the new array
						- For those old members, also update the lookup table so that they are now pointing to that new disjoint set
	- DFA find
		- For a certain disjoint set:
			- Sort the members points in row-major order
			- Generate the input string for the DFA, where each character is of the from (movement direction, to-state color)
				- The movement direction takes the form of the row-major order of traversal
				- The to-state color should be:
					- o if any of the adjacent neighbors are non-o
					- x (don't care) if all 4 cells in cardinal direction of this cell are not non-o (may need a hash set for this)
					- c where c is the color of the cell if the current cell is an exact match of a member
			- Pass that input string through the dfa
				- if the final state is a acceptance state then get the generating cells from the state and add those to the board (using the add subroutine)
				- if the final state is not acceptance, then there is no match with a dictionary shape
