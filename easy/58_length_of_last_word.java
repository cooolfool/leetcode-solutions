class Solution {
    public int lengthOfLastWord(String s) {
        String [] str =s.split(" ",0);
        int len=str.length;
        return str[len-1].length();

        
    }
}