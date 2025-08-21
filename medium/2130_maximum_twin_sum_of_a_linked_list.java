/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public int pairSum(ListNode head) {
         ArrayList<Integer> l=new ArrayList<>();
       int n=0;
       while(head!=null){
           l.add(head.val);
           head=head.next;
           n++;
       }
    int sum=0;
    for(int i=0;i<n/2;i++){
        int p=l.get(i)+l.get(n-1-i);
        if(p>sum)
        sum=p;
    }
    return sum;

    }
}