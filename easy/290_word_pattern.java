class Solution {
    public boolean wordPattern(String pattern, String s) {
        String [] array = s.split(" ",0);
        Map<Character,String> map = new HashMap<>();
         Map<String,Character> map1 = new HashMap<>();
        if(pattern.length()!=array.length)
        return false;

        for(int i=0;i<pattern.length();i++){

                if(map.containsKey(pattern.charAt(i))){
                    if(!map.get(pattern.charAt(i)).equals(array[i]))
                    return false;
                }

                else { 
                    map.put(pattern.charAt(i),array[i]);
                }

        }

        for(int i=0;i<pattern.length();i++){

                if(map1.containsKey(array[i])){
                    if(!map1.get(array[i]).equals(pattern.charAt(i)))
                    return false;
                }

                else { 
                    map1.put(array[i],pattern.charAt(i));
                }

        }

        return true;

    }
}